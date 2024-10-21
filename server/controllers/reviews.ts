import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.js";
import model from "../repositories/mongoose.js";
import Review from "../repositories/review.ts";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  try {
    const campground = await model.findCampgroundById(req.params.id);
    if (campground === null) {
      return res.status(404).json({ message: "Campground not found." });
    }
    if (!req.user) {
      return res.status(401).json({ message: "User is not logged in." });
    }
    const { review, rating } = req.body;
    const newReview = new Review({
      review: review,
      rating: rating,
      author: req.user._id,
    });
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    return res.status(200).json({ message: "Review added sucessfully" });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User is not logged in." });
    }
    const userid = req.user._id;
    const { id, reviewid } = req.params;
    await model.deleteReviewInCampground(id, reviewid, userid);
    await Review.findByIdAndDelete(reviewid);
    return res.status(200).json({ message: "Review Deleted" });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
