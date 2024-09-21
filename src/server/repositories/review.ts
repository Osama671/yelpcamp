import mongoose, {Types} from "mongoose";

const Schema = mongoose.Schema

interface IReviewSchema{
  review: string,
  rating: number,
  author: Types.ObjectId
}

const reviewSchema = new Schema<IReviewSchema>({
  review: String,
  rating: Number,
  author:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
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
