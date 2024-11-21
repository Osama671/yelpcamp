import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.js";
import model from "../repositories/mongoose.js";
import Review, { modelFetchReviewsByUserId } from "../repositories/review.ts";
import ExpressError from "../../src/util/ExpressError.ts";
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
    console.log("reqL", req.user);
    console.log("camp:", campground.author._id);
    if (req.user._id.toString() === campground.author._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can't review your own campground" });
    }
    const { review, rating } = req.body;
    const newReview = new Review({
      review: review,
      rating: rating,
      author: req.user._id,
      campground: campground,
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

export const fetchReviewsByUserId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ExpressError("User not found", 401);
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const productsPerPage = req.query.productsPerPage
      ? Number(req.query.productsPerPage)
      : 0;
    const { id } = req.query;
    const userId = String(id);
    const campgrounds = await modelFetchReviewsByUserId(
      userId,
      page,
      productsPerPage
    );
    return res.status(200).json(campgrounds);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
