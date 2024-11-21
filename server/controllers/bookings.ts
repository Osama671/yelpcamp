import { Request, Response } from "express";
import ExpressError from "../../src/util/ExpressError.ts";
import BookingRepo from "../repositories/bookings.ts";
import CampgroundRepo from "../repositories/mongoose.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import moment from "moment";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { id: campgroundId } = req.params;
    let { startDate, endDate } = req.body;
    startDate = moment(startDate).format("L");
    endDate = moment(endDate).format("L");

    if (!req.user)
      return res.status(403).json({ message: "User not logged in" });
    const campground = await CampgroundRepo.findCampgroundById(campgroundId);
    if (campground?.author?._id.equals(req.user._id))
      return res
        .status(401)
        .json({ message: "You cannot book your own campground" });

    const userId = req.user._id.toString();

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
