import mongoose, { Schema } from "mongoose";
import cities from "../../src/seeds/cities.ts";
import { faker } from "@faker-js/faker";
import Review, { findReviewById } from "./review.ts";
import ExpressError from "../../src/util/ExpressError.ts";
import cloudinary from "../../src/cloudinary/cloudinary.ts";

const seedAmount = 50;

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
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);

async function seedCampgrounds() {
  await Campground.deleteMany({});
  Array(seedAmount)
    .fill(undefined)
    .map(async (_, i) => {
      const random = Math.floor(Math.random() * 1000);
      const randomPrice = Math.floor(Math.random() * 30) + 5;
      const newCampground = new Campground({
        title: `Title${i}`,
        location: `${cities[random].city}, ${cities[random].state}`,
        description: `${faker.company.catchPhraseDescriptor()}, ${faker.animal.bear()}`,
        images: [
          {
            url: `https://picsum.photos/900?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/900/1200?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/300/1500?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/1900/300?random=${Math.random()}`,
            filename: "",
          },
        ],
        geometry: {
          type: "Point",
          coordinates: [cities[random].longitude, cities[random].latitude],
        },
        price: randomPrice,
        author: "66e607e21575667c3d0a7dc6",
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
  const query: {
    $or?: Array<{ title?: { $regex: RegExp }; location?: { $regex: RegExp } }>;
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
}

async function findCampgroundById(id: string) {
  try {
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: "author" })
      .populate("author");
    return campground;
  } catch (e) {
    throw new ExpressError(`Database Error: ${e}`, 404);
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
        deleteImages.map(async (filename) => {
          //If placeholdeer image (no filename in cloud), pull img from db based on url
          //filename being passed will either be url (if placeholder) or cloud filename (if uploaded by user)
          if (filename.startsWith("http")) {
            await Campground.updateOne(
              { _id: campgroundId },
              { $pull: { images: { url: { $in: filename } } } }
            );
            return;
          }
          await cloudinary.cloudinary.uploader.destroy(filename);
        });
        await Campground.updateOne(
          { _id: campgroundId },
          { $pull: { images: { filename: { $in: deleteImages } } } }
        );
      }
    }
    return;
  } catch (e) {
    throw new ExpressError(`Problem occured in DB : ${e}`, 500);
  }
}

export async function deleteReviewInCampground(
  campgroundid: string,
  reviewid: string,
  userid: string
) {
  const review = await findReviewById(reviewid, userid);

  if (!review.author.equals(userid)) {
    throw new ExpressError("You are not the author of this review", 403);
  }
  await Campground.findOneAndUpdate(
    { _id: campgroundid },
    { $pull: { reviews: reviewid } }
  );
}

async function deleteCampgroundById(id: string, userid: string) {
  const campground = await findCampgroundById(id);
  if (!campground) throw new ExpressError("Campground not found", 500);
  if (!campground.author.equals(userid)) {
    throw new ExpressError("You are not the author of this campground", 403);
  }
  await Campground.findByIdAndDelete({ _id: id });
}

const campgroundModel = {
  findAllCampgrounds,
  findCampgroundById,
  createCampground,
  editCampground,
  deleteCampgroundById,
  deleteReviewInCampground,
};

export default campgroundModel;
