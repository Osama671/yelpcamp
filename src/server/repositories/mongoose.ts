import mongoose, { Schema } from "mongoose";
import cities from "../../seeds/cities.ts";
import { faker } from "@faker-js/faker";
import Review from "./review.ts";
import ExpressError from "../../util/ExpressError.ts";
import cloudinary from "../../cloudinary/cloudinary.ts";

const seedAmount = 50;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myProject");
}

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
        type: [Number],
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
  return `<strong><a href=# id="navigate-link" data-id=${this._id}>${this.title}</a></strong>`
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("campground", campgroundSchema);

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
            url: `https://picsum.photos/400?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/400?random=${Math.random()}`,
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

async function findAllCampgrounds() {
  return await Campground.find({});
}

async function findCampgroundById(id: string) {
  return await Campground.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("author");
}

async function createCampground(
  geometry: { type: string; coordinates: number[] },
  location: string,
  description: string,
  price: string,
  title: string,
  images: IImages[],
  id: string
) {
  const newCampground = new Campground({
    geometry: geometry,
    location: `${location}`,
    description: `${description}`,
    price: price,
    title: `${title}`,
    images: images,
    author: id,
  });
  await newCampground.save();
}

async function editCampground(
  campgroundId: string,
  location: string,
  description: string,
  price: string,
  title: string,
  images: IImages[],
  userid: string,
  deleteImages: string[]
) {
  const campground = await findCampgroundById(campgroundId);
  if (!campground) throw new ExpressError("Campground not found", 500);
  if (!campground.author.equals(userid)) {
    return new ExpressError("You are not the author of this campground", 403);
  }

  const update = {
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

  if (deleteImages.length !== 0) {
    deleteImages.map(async (filename) => {
      await cloudinary.cloudinary.uploader.destroy(filename);
    });
    await Campground.updateOne(
      { _id: campgroundId },
      { $pull: { images: { filename: { $in: deleteImages } } } }
    );
  }
  return;
}

export async function deleteReviewInCampground(id: string, reviewid: string) {
  await Campground.findOneAndUpdate(
    { _id: id },
    { $pull: { reviews: reviewid } }
  );
}

async function deleteCampgroundById(id: string, userid: string) {
  const campground = await findCampgroundById(id);
  if (!campground) throw new ExpressError("Campground not found", 500);
  if (!campground.author.equals(userid)) {
    return new ExpressError("You are not the author of this campground", 403);
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
