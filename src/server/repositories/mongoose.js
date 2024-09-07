import mongoose, { mongo } from "mongoose";
import cities from "../../seeds/cities.js";
import { faker } from "@faker-js/faker";

const seedAmount = 2;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myProject");
}

const campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

const Campground = mongoose.model("campground", campgroundSchema);

async function seedCampgrounds() {
  await Campground.deleteMany({});
  Array(seedAmount)
    .fill(undefined)
    .map(async (_, i) => {
      const random = Math.floor(Math.random() * 1000);
      const randomPrice = Math.floor(Math.random() * 30) + 5
      const newCampground = new Campground({
        title: `Title${i}`,
        location: `${cities[random].city}, ${cities[random].state}`,
        description: `${faker.company.catchPhraseDescriptor()}, ${faker.animal.bear()}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        price: randomPrice
      });
      await newCampground.save();
    });
}
seedCampgrounds();

export async function findAllCampgrounds() {
  return await Campground.find({});
}

export async function findCampgroundById(id) {
  return await Campground.findById(id);
}

export async function createCampground(location, description) {
  const newCampground = new Campground({
    location: `${location}`,
    description: `${description}`,
  });
  await newCampground.save();
}

export async function editCampground(id, location, description) {
  const update = { location: location, description: description };
  await Campground.findOneAndUpdate({ _id: id }, update, { new: true });
}

export async function deleteCampgroundById(id) {
  await Campground.findOneAndDelete({ _id: id });
}
