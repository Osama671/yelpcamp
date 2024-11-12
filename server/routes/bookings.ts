import express from "express";
import { createBooking, fetchBookingsByCampgroundId } from "../controllers/bookings.ts";
import { validateBooking } from "../repositories/schemas/bookings.ts";

const router = express.Router();

router.get("/:campground", fetchBookingsByCampgroundId)

router.post("/:id", validateBooking, createBooking);

export default router;
