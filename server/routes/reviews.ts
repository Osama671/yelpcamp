import express from "express";
import { createReview, deleteReview } from "../controllers/reviews.ts";
import { validateReview } from "../repositories/schemas/schema.ts";
const router = express.Router({ mergeParams: true });

router.post("/", validateReview, createReview);

router.delete("/:reviewid", deleteReview);

export default router;
