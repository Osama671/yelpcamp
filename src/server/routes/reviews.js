import express from "express";
import { createReview, deleteReview } from "../controllers/reviews.js";
import catchAsync from "../../util/catchAsync.js";
import { validateReview } from "../repositories/schemas/schema.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateReview,
  catchAsync(createReview)
);

router.delete(
  "/:reviewid",
  catchAsync(deleteReview)
);

export default router;
