import mongoose, { Schema } from "mongoose";
import cities from "../../src/seeds/cities.ts";
import Review, { findReviewById } from "./review.ts";
import ExpressError from "../../src/util/ExpressError.ts";
import cloudinary from "../../src/cloudinary/cloudinary.ts";
import { Booking } from "./bookings.ts";
import { clearCache } from "../controllers/campgrounds.ts";
import data from "../../src/seeds/seedData.ts";

const seedAmount = 80;

interface IImages {
  filename: string;
  url: string;
}

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
  {
    title: String,
    images: [{ url: String, filename: String }],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number, Number],
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  opts
);

//TODO: Better implementation without passing id as data-id, but passing it from MapBox directly in Clustermap.tsx
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href=# id="navigate-link" data-id=${this._id}>${this.title}</a></strong>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    await Booking.deleteMany({ _id: { $in: doc.bookings } });
  }
});

export const Campground = mongoose.model("Campground", campgroundSchema);

async function seedCampgrounds() {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  await Booking.deleteMany({});
  clearCache();
  Array(seedAmount)
    .fill(undefined)
    .map(async () => {
      const random = Math.floor(Math.random() * 1000);
      const randomPrice = Math.floor(Math.random() * 30) + 5;
      const newCampground = new Campground({
        title: data.title[Math.floor(Math.random() * data.title.length)],
        location: `${cities[random].city}, ${cities[random].state}`,
        description:
          data.description[Math.floor(Math.random() * data.description.length)],
        images: [
          ...Array(Math.ceil(Math.random() * 5))
            .fill(undefined)
            .map(() => ({
              url: `https://picsum.photos/900?random=${Math.random()}`,
              filename: "",
            })),
        ],
        geometry: {
          type: "Point",
          coordinates: [cities[random].longitude, cities[random].latitude],
        },
        price: randomPrice,
        author: "675f8050a44a61eb60a4487a",
      });
      await newCampground.save();
    });
}
seedCampgrounds();

async function findAllCampgrounds(
  page: number = 1,
  productsPerPage: number = 0,
  searchQuery: string = ""
) {
  try {
    const query: {
      $or?: Array<{
        title?: { $regex: RegExp };
        location?: { $regex: RegExp };
      }>;
    } = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { location: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const campgrounds = await Campground.find(query)
      .populate("author")
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);

    const campgroundsCount = await Campground.find(query).countDocuments();
    const queryData = { campgrounds: campgrounds, count: campgroundsCount };
    return queryData;
  } catch (e) {
    console.error(e);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

async function findCampgroundById(id: string) {
  try {
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: "author" })
      .populate("author")
      .populate("bookings");
    return campground;
  } catch (e) {
    console.error(e);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

async function createCampground(
  geometry: { coordinates: number[] },
  location: string,
  description: string,
  price: string,
  title: string,
  images: IImages[],
  id: string
) {
  try {
    const newCampground = new Campground({
      geometry: { type: "Point", ...geometry },
      location: `${location}`,
      description: `${description}`,
      price: price,
      title: `${title}`,
      images: images,
      author: id,
    });

    await newCampground.save();
    return newCampground;
  } catch (e) {
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

async function editCampground(
  geometry: { coordinates: number[] },
  campgroundId: string,
  location: string,
  description: string,
  price: string,
  title: string,
  images: IImages[],
  userid: string,
  deleteImages: string[]
) {
  try {
    const campground = await findCampgroundById(campgroundId);
    if (!campground) throw new ExpressError("Campground not found", 500);
    if (!campground.author.equals(userid)) {
      throw new ExpressError("You are not the author of this campground", 403);
    }

    const update = {
      geometry: { type: "Point", ...geometry },
      location: location,
      description: description,
      price: price,
      title: title,
    };

    await Campground.findOneAndUpdate({ _id: campgroundId }, update, {
      new: true,
    });

    campground.images = [...campground.images, ...images];
    await campground.save();
    if (deleteImages) {
      if (deleteImages.length !== 0) {
        deleteImages.map(async (imageurl) => {
          //If placeholdeer image (no filename in cloud), pull img from db based on url
          //filename being passed will either be url (if placeholder) or cloud filename (if uploaded by user)
          if (imageurl.startsWith("http")) {
            await Campground.updateOne(
              { _id: campgroundId },
              { $pull: { images: { url: { $in: imageurl } } } }
            );
            return;
          }
          await cloudinary.cloudinary.uploader.destroy(imageurl);
        });
        await Campground.updateOne(
          { _id: campgroundId },
          { $pull: { images: { filename: { $in: deleteImages } } } }
        );
      }
    }
    return;
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

export async function deleteReviewInCampground(
  campgroundid: string,
  reviewid: string,
  userid: string
) {
  try {
    const review = await findReviewById(reviewid, userid);

    if (!review.author.equals(userid)) {
      throw new ExpressError("You are not the author of this review", 403);
    }
    await Campground.findOneAndUpdate(
      { _id: campgroundid },
      { $pull: { reviews: reviewid } }
    );
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

async function deleteCampgroundById(id: string, userid: string) {
  try {
    const campground = await findCampgroundById(id);
    if (!campground) throw new ExpressError("Campground not found", 404);
    if (!campground.author.equals(userid)) {
      throw new ExpressError("You are not the author of this campground", 403);
    }
    await Campground.findByIdAndDelete({ _id: id });
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError(`Database error`, 500);
  }
}

async function fetchCampgroundsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  try {
    const campgrounds = await Campground.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgReviewRating: {
            $ifNull: [
              {
                $trunc: [
                  {
                    $avg: {
                      $map: {
                        input: "$reviews",
                        as: "review",
                        in: "$$review.rating",
                      },
                    },
                  },
                  2,
                ],
              },
              "N/A",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "bookings",
          foreignField: "_id",
          as: "bookings",
        },
      },
      {
        $addFields: {
          upcomingBookings: {
            $size: {
              $filter: {
                input: "$bookings",
                as: "booking",
                cond: {
                  $gte: [
                    "$$booking.startDate",
                    new Date(new Date().setHours(0, 0, 0, 0)),
                  ],
                },
              },
            },
          },
        },
      },
    ])
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);
    const campgroundsCount = await Campground.find({
      author: userId,
    }).countDocuments();
    const queryData = { campgrounds: campgrounds, count: campgroundsCount };
    return queryData;
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

async function fetchSearchDropdownResults(searchQuery: string) {
  try {
    const query: {
      $or?: Array<{
        title?: { $regex: RegExp };
        location?: { $regex: RegExp };
      }>;
    } = {};

    query.$or = [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { location: { $regex: new RegExp(searchQuery, "i") } },
    ];
    const searchResults = Campground.find(query);
    return searchResults;
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError("Error in DB", 500);
  }
}

const campgroundModel = {
  findAllCampgrounds,
  findCampgroundById,
  createCampground,
  editCampground,
  deleteCampgroundById,
  deleteReviewInCampground,
  fetchCampgroundsByUserId,
  fetchSearchDropdownResults,
};

export default campgroundModel;
