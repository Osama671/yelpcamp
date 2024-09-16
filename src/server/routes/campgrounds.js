import {
  showAllCampgrounds,
  showCampgroundEdit,
  editCampground,
  showCampgroundDetails,
  createCampground,
  deleteCampground,
} from "../controllers/campgrounds.js";
import express from "express";
import catchAsync from "../../util/catchAsync.js";
import ExpressError from "../../util/ExpressError.js";
import { validateCampground } from "../repositories/schemas/schema.js";

const router = express.Router();

// GOING TO TRY USING THIS LATER. WILL KEEP FOR NOW.
// const isAuthor = async(req, res, next) => {
//   const { id } = req.params;
//   const campground = await findCampgroundById(id);
//   console.log(campground.author)
//   console.log(req.user._id)
//   if (!campground) throw new ExpressError("Campground not found", 500);
//   if (!campground.author.equals(req.user._id)) {
//     return new ExpressError("You are not the author of this campground", 403);
//   }
// };

router.get("/", catchAsync(showAllCampgrounds));

router.post("/", validateCampground, catchAsync(createCampground));

router.get("/:id", catchAsync(showCampgroundDetails));

router.delete("/:id", catchAsync(deleteCampground));

router.get("/:id/edit", catchAsync(showCampgroundEdit));

router.post("/:id/edit", validateCampground, catchAsync(editCampground));

export default router;
