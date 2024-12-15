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
  try {
    const review = await Review.findById(id);
    if (!review.author.equals(userid)) {
      throw new ExpressError("You are not the author of this review", 403);
    }
    return review;
  } catch (e) {
    console.error(`Error in DB: ${e}`);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

export async function modelFetchReviewsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  try {
    const reviews = await Review.find({ author: userId })
      .populate({ path: "campground", select: "_id images title" })
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);
    const reviewsCount = await Review.find({
      author: userId,
    }).countDocuments();
    const queryData = { reviews: reviews, count: reviewsCount };
    return queryData;
  } catch (e) {
    console.log(`Error in DB: ${e}`);
    throw new ExpressError(
      `Error in campgrounds repo with the error: ${e}`,
      500
    );
  }
}

export default Review;
