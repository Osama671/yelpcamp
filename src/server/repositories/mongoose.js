import mongoose, { mongo } from "mongoose";
import cities from "../../seeds/cities.js";
import { faker } from "@faker-js/faker";
import Review from "./review.js";
import ExpressError from "../../util/ExpressError.js";

const seedAmount = 2;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myProject");
}

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  images: [{ url: String, filename: String }],
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
        images: {
          url: `https://picsum.photos/400?random=${Math.random()}`,
          filename: "",
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

async function findCampgroundById(id) {
  return await Campground.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("author");
}

async function createCampground(
  location,
  description,
  price,
  title,
  images,
  id
) {
  const newCampground = new Campground({
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
  id,
  location,
  description,
  price,
  title,
  imageurl,
  userid
) {
  const update = {
    location: location,
    description: description,
    price: price,
    title: title,
    image: imageurl,
  };
  const campground = await findCampgroundById(id);
  if (!campground) throw new ExpressError("Campground not found", 500);
  if (!campground.author.equals(userid)) {
    return new ExpressError("You are not the author of this campground", 403);
  }
  await Campground.findOneAndUpdate({ _id: id }, update, { new: true });
}

export async function deleteReviewInCampground(id, reviewid) {
  await Campground.findOneAndUpdate(
    { _id: id },
    { $pull: { reviews: reviewid } }
  );
}

async function deleteCampgroundById(id, userid) {
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
