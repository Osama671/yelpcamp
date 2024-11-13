import express from "express";
import {
  createBooking,
  fetchFutureBookingsByCampgroundId,
} from "../controllers/bookings.ts";
import { validateBooking } from "../repositories/schemas/bookings.ts";

const router = express.Router();

router.post("/:id", validateBooking, createBooking);

router.get("/:campground/future", fetchFutureBookingsByCampgroundId);

export default router;
