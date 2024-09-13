import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  review: String,
  rating: Number,
});

const Review = mongoose.model("Review", reviewSchema);

// async function createReview(review, rating) {
//   const newReview = new Review({
//     review: review,
//     rating: rating,
//   });
//   return newReview
// }

export default Review;
