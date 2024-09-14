import {
  findAllCampgrounds,
  findCampgroundById,
  createCampground,
  editCampground,
  deleteCampgroundById,
} from "../repositories/mongoose.js";

import express from "express";
import catchAsync from "../../util/catchAsync.js";
import ExpressError from "../../util/ExpressError.js";
import { validateCampground } from "../repositories/schemas/schema.js";

const router = express.Router();

const isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await findCampgroundById(id);
  console.log(campground.author)
  console.log(req.user._id)
  if (!campground) throw new ExpressError("Campground not found", 500);
  if (!campground.author.equals(req.user._id)) {
    return new ExpressError("You are not the author of this campground", 403);
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await findAllCampgrounds();
    res.json(campgrounds);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await findCampgroundById(id);
    res.json(campground);
  })
);

router.post(
  "/:id/edit",
  validateCampground,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { location, description, price, title, imageurl } = req.body;
    const userid = req.user._id;
    await editCampground(
      id,
      location,
      description,
      price,
      title,
      imageurl,
      userid
    );
    res.redirect(`/campground/${id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await findCampgroundById(id);
    res.json(campground);
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { location, description, price, title, imageurl } = req.body;
    await createCampground(
      location,
      description,
      price,
      title,
      imageurl,
      req.user._id
    );
    res.redirect("/campgrounds");
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const userid = req.user._id;
    await deleteCampgroundById(id, userid);
    res.status(200).json({ message: `Campground ID ${id} Deleted.` });
  })
);

export default router;
