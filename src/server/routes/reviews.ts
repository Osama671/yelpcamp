import express from "express";
import { createReview, deleteReview } from "../controllers/reviews.ts";
import catchAsync from "../../util/catchAsync.ts";
import { validateReview } from "../repositories/schemas/schema.ts";
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
