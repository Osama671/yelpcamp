import { Request, Response } from "express";
import BookingRepo from "../repositories/bookings.ts";
import ExpressError from "../../src/util/ExpressError.ts";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { id: campgroundId } = req.params;
    const { startDate, endDate, user: userId } = req.body;
    if (!userId) throw new ExpressError("Not logged in", 403);

    BookingRepo.createBooking(startDate, endDate, userId, campgroundId);
    return res.status(200).json({ message: "Booking created" });
  } catch (e) {
    throw new ExpressError(`Server error, rip: ${e}`, 500);
  }
};
