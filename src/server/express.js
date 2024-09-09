import {
  findAllCampgrounds,
  findCampgroundById,
  createCampground,
  editCampground,
  deleteCampgroundById,
} from "./repositories/mongoose.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import ExpressError from "../util/ExpressError.js";
import catchAsync from "../util/catchAsync.js";
import Joi from "joi"
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

app.get("/api/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await findAllCampgrounds();
  res.json(campgrounds);
}));

app.get("/api/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await findCampgroundById(id);
  res.json(campground);
}));

app.post("/api/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params;
  const { location, description, price, title, imageurl } = req.body;
  await editCampground(id, location, description, price, title, imageurl);
  res.redirect(`/campground/${id}`);
}));

app.get("/api/campgrounds/:id", catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await findCampgroundById(id);
  res.json(campground);
}));

app.post("/api/campgrounds", catchAsync(async (req, res, next) => {
  const campgroundSchema = Joi.object({
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(10),
    title: Joi.string().required(),
    description: Joi.string().required()
  }).required()
  const result = campgroundSchema.validate(req.body)
  console.log(result)
  if(result.error){
    throw new ExpressError(result.error.details, 400)
  }
  const { location, description, price, title, imageurl } = req.body;
  
  createCampground(location, description, price, title, imageurl);
}));

app.delete("/api/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteCampgroundById(id);
  res.status(200).json({ message: `Campground ID ${id} Deleted.` });
}));

app.get(
  "/error",
  catchAsync((req, res, next) => {
    throw new ExpressError("Bad Error", 401)
  })
);

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).send(message)
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


