import mongoose from "mongoose";
import ExpressError from "../../util/ExpressError.ts";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);

export async function findReviewById(id: string, userid?: string) {
  const review = await Review.findById(id);
  if (!review.author.equals(userid)) {
    throw new ExpressError("You are not the author of this review", 403);
  }
  return review;
}
// async function createReview(review, rating) {
//   const newReview = new Review({
//     review: review,
//     rating: rating,
//   });
//   return newReview
// }

export default Review;
