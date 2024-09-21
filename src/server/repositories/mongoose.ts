import mongoose, { Schema } from "mongoose";
import cities from "../../seeds/cities.ts";
import { faker } from "@faker-js/faker";
import Review from "./review.ts";
import ExpressError from "../../util/ExpressError.ts";

const seedAmount = 2;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myProject");
}

interface IImages {
  filename: string;
  url: string;
}


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

campgroundSchema.post(
  "findOneAndDelete",
  async function (doc) {
    if (doc) {
      await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
  }
);

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

async function findCampgroundById(id: string) {
  return await Campground.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("author");
}

async function createCampground(
  location: string,
  description: string,
  price: string,
  title: string,
  images: IImages[],
  id: string
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
  id: string,
  location: string,
  description: string,
  price: string,
  title: string,
  imageurl: string,
  userid: string
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
