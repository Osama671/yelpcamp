import mongoose, { Types } from "mongoose";
import campgroundRepo, { Campground } from "./mongoose.ts";
import ExpressError from "../../src/util/ExpressError.ts";

interface IBooking {
  startDate: Date;
  endDate: Date;
  author: string;
  campground: string;
}

interface IFetchBookingByCampground {
  _id: Types.ObjectId;
  bookings: [];
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
    const campground = await campgroundRepo.findCampgroundById(campgroundId);
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

async function fetchBookingsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  const bookings = await Booking.find({ author: userId })
    .populate("campground")
    .populate("author")
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);

  const bookingsCount = await Booking.find({
    author: userId,
  }).countDocuments();
  const queryData = { bookings: bookings, count: bookingsCount };
  return queryData;
}

async function fetchBookingsByCampgroundId(campgroundId: string) {
  const campground = await Campground.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(campgroundId),
      },
    },
    {
      $unwind: {
        path: "$bookings",
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookings",
        foreignField: "_id",
        as: "bookings",
      },
    },
    {
      $unwind: {
        path: "$bookings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "bookings.author",
        foreignField: "_id",
        as: "bookings.author",
      },
    },
    {
      $unwind: {
        path: "$bookings.author",
      },
    },
    {
      $match: {
        "bookings.startDate": {
          $gt: new Date(),
        },
      },
    },
  ]);

  return campground;
}

const BookingRepo = {
  createBooking,
  findBookingById,
  fetchBookingsByUserId,
  fetchBookingsByCampgroundId,
};

export default BookingRepo;
