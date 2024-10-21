import express from "express";
import { createBooking } from "../controllers/bookings.ts";

const router = express.Router();

router.post("/:id", createBooking);

export default router;
