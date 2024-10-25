import express from "express";
import { createBooking } from "../controllers/bookings.ts";
import { validateBooking } from "../repositories/schemas/bookings.ts";

const router = express.Router();

router.post("/:id", validateBooking, createBooking);

export default router;
