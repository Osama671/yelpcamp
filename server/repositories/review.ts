import mongoose from "mongoose";
import ExpressError from "../../src/util/ExpressError.ts";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
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

export async function modelFetchReviewsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  const reviews = await Review.find({ author: userId })
    .populate({ path: "campground", select: "_id images title" })
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);
  const reviewsCount = await Review.find({
    author: userId,
  }).countDocuments();
  const queryData = { reviews: reviews, count: reviewsCount };
  return queryData;
}
// async function createReview(review, rating) {
//   const newReview = new Review({
//     review: review,
//     rating: rating,
//   });
//   return newReview
// }

export default Review;
