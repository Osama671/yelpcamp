import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    body: String,
    rating: Number,
})

const Review = mongoose.model("Review", reviewSchema)

export default Review