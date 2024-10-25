import { Request, Response } from "express";
import BookingRepo from "../repositories/bookings.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { id: campgroundId } = req.params;
    const { startDate, endDate, user: userId } = req.body;
    if (!userId) return res.status(403).json({ message: "User not logged in" });

    BookingRepo.createBooking(startDate, endDate, userId, campgroundId);

    return res.status(200).json({ message: "Booking created" });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
