import { Request, Response, NextFunction } from "express";
import ExpressError from "../../../src/util/ExpressError.ts";
import ExpressErrorGeneric from "../../../src/util/ExpressErrorGeneric.ts";
import CampgroundsModel from "../mongoose.ts";
import { Booking } from "../../../types.ts";

export const validateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: campgroundId } = req.params;
    const { startDate, endDate, user: userId } = req.body;
    if (!userId) throw new ExpressError("You must be logged in to book", 403);
    const currentDate = Date.parse(new Date().toDateString());

    const campground = await CampgroundsModel.findCampgroundById(campgroundId);
    if (campground?.author?._id == userId)
      throw new ExpressError("You can't book on your own campground bruh", 400);

    const newStartDate = Date.parse(startDate);
    const newEndDate = Date.parse(endDate);

    if (newStartDate > newEndDate)
      throw new ExpressError("Start date can't be ahead of end date", 400);
    else if (newStartDate < +currentDate || newEndDate < +currentDate)
      throw new ExpressError(
        "Start date or end date can't be before your own date, C'mon bro",
        400
      );

    // Check if the booking overlaps
    if (campground?.bookings) {
      campground.bookings.map((booking: Booking) => {
        const { startDate, endDate } = booking;
        const available = IsBookingAvailable(
          Date.parse(startDate),
          Date.parse(endDate),
          newStartDate,
          newEndDate
        );
        if (available === false)
          throw new ExpressError(
            "Booking overlapping with other bookings. Please change dates.",
            400
          );
      });
    }

    next();
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

// Man this code is something. I need pen and paper to explain this.
function IsBookingAvailable(
  oldStartDate: number,
  oldEndDate: number,
  newStartDate: number,
  newEndDate: number
) {
  if (newStartDate === oldStartDate || newEndDate === oldEndDate) return false;
  else if (newStartDate > oldStartDate) {
    if (newStartDate > oldEndDate) {
      return true;
    }
    return false;
  } else if (oldStartDate > newEndDate) {
    return true;
  } else if (newEndDate > oldStartDate) {
    return false;
  }
  return true;
}
