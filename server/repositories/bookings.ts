import mongoose from "mongoose";
import model from "./mongoose.ts";
import ExpressError from "../../src/util/ExpressError.ts";

interface IBooking {
  startDate: Date;
  endDate: Date;
  author: string;
  campground: string;
}

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  startDate: Date,
  endDate: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);

export async function createBooking(
  startDate: Date,
  endDate: Date,
  userId: string,
  campgroundId: string
) {
  try {
    const newBooking = new Booking({
      startDate: startDate,
      endDate: endDate,
      author: userId,
      campground: campgroundId,
    });

    await newBooking.save();
    updateCampground(newBooking, campgroundId);
  } catch (e) {
    throw new ExpressError(`Error in DB: ${e}`, 500);
  }
}

async function updateCampground(booking: IBooking, campgroundId: string) {
  try {
    const campground = await model.findCampgroundById(campgroundId);
    if (campground) {
      campground.bookings.push(booking);
      await campground.save();
    }
  } catch (e) {
    throw new ExpressError(`Error in DB: ${e}`, 500);
  }
}

async function findBookingById(BookingId: string) {
  const booking = await Booking.findById(BookingId);
  return booking;
}

const BookingRepo = {
  createBooking,
  findBookingById,
};

export default BookingRepo;
