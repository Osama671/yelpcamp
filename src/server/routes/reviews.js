import {
  findCampgroundById,
  deleteReviewInCampground,
} from "../repositories/mongoose.js";
import Review from "../repositories/review.js";
import express from "express";
import ExpressError from "../../util/ExpressError.js";
import catchAsync from "../../util/catchAsync.js";
import { validateReview } from "../repositories/schemas/schema.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await findCampgroundById(req.params.id);
    if (campground === null) {
      throw new ExpressError("campground is null", 401);
    }
    const { review, rating } = req.body;
    const newReview = new Review({ review: review, rating: rating });
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.status(200).send("Review Added!");
  })
);

router.delete(
  "/:reviewid",
  catchAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    await deleteReviewInCampground(id, reviewid);
    await Review.findByIdAndDelete(reviewid);
    res.send("Review Deleted");
  })
);

export default router;
