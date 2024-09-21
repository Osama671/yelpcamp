import ExpressError from "../../util/ExpressError.js"
import model from "../repositories/mongoose.js";
import Review from "../repositories/review.ts";
import {Request, Response} from "express"

export const createReview = async (req: Request, res: Response) => {
  const campground = await model.findCampgroundById(req.params.id);
  if (campground === null) {
    throw new ExpressError("campground is null", 401);
  }
  if(!req.user){
    return res.json({message: "User not logged in"})
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
  res.status(200).send("Review Added!");
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id, reviewid } = req.params;
  await model.deleteReviewInCampground(id, reviewid);
  await Review.findByIdAndDelete(reviewid);
  res.send("Review Deleted");
};
