import {
  findAllCampgrounds,
  findCampgroundById,
  createCampground,
  editCampground,
  deleteCampgroundById,
} from "./repositories/mongoose.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import { Router } from "express";
import express from "express";
import cors from "cors";
import path from "path";
import AppError from "../util/AppError.js";
const app = express();
const PORT = process.env.PORT || 8080;
// app.use(express.static(path.join(__dirname, 'src')))

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/data", (req, res) => {
  console.log("Test");
  res.json({ message: "Hey" });
});

app.get("/api/campgrounds", async (req, res) => {
  const campgrounds = await findAllCampgrounds();
  res.json(campgrounds);
});

app.get("/api/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await findCampgroundById(id);
  res.json(campground);
});

app.post("/api/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { location, description, price, title, imageurl } = req.body;
  await editCampground(id, location, description, price, title, imageurl);
  res.redirect(`/campground/${id}`);
});

app.get("/api/campgrounds/:id", async (req, res, next) => {
  const { id } = req.params;
  const campground = await findCampgroundById(id);
  res.json(campground);
});

app.post("/api/campgrounds", async (req, res) => {
  const { location, description, price, title, imageurl } = req.body;
  createCampground(location, description, price, title, imageurl);
});

app.delete("/api/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await deleteCampgroundById(id);
  res.status(200).json({ message: `Campground ID ${id} Deleted!` });
});

app.get(
  "/error",
  wrapFunc((req, res, next) => {
    throw new AppError("Hello there stoooopid", 402);
  })
);

app.use((err, req, res, next) => {
  const { status = 500, message = "ayyowtf" } = err;
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function wrapFunc(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}
