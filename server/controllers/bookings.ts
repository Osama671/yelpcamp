import { Request, Response } from "express";
import ExpressError from "../../src/util/ExpressError.ts";
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

export const fetchBookingsByUserId = async (req: Request, res: Response) => {
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
    const campgrounds = await BookingRepo.fetchBookingsByUserId(
      userId,
      page,
      productsPerPage
    );
    return res.status(200).json(campgrounds);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const fetchFutureBookingsByCampgroundId = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new ExpressError("User not found", 401);
    }
    const { campground: campgroundId } = req.params;
    const bookings = await BookingRepo.fetchFutureBookingsByCampgroundId(
      campgroundId
    );
    res.status(200).json(bookings);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const fetchPastBookingsByCampgroundId = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      throw new ExpressError("User not found", 401);
    }
    const { campground: campgroundId } = req.params;
    const bookings = await BookingRepo.fetchPastBookingsByCampgroundId(
      campgroundId
    );
    res.status(200).json(bookings);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};