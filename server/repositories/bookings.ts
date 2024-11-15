import mongoose from "mongoose";
import campgroundRepo, { Campground } from "./mongoose.ts";
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
  try{
  const bookings = await Booking.aggregate([
    {
      $match:
        {
          author: new mongoose.Types.ObjectId(userId)
        }
    },
    {
      $lookup:
        {
          from: "campgrounds",
          localField: "campground",
          foreignField: "_id",
          as: "campground"
        }
    },
    {
      $unwind:
        {
          path: "$campground"
        }
    },
    {
      $match:
        {
          startDate: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            )
          }
        }
    },
    {
      $sort:
        {
          startDate: 1
        }
    }
  ])
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);

  const bookingsCount = await Booking.find({
    author: userId,
  }).countDocuments();
  const queryData = { bookings: bookings, count: bookingsCount };
  return queryData;
}
catch(e){
  throw new Error(`DB Error: ${e}`)
}
}

async function fetchFutureBookingsByCampgroundId(campgroundId: string) {
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
      $match: {
        "bookings.startDate": {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
      },
    },
    {
      $sort: {
        "bookings.startDate": 1,
      },
    },
  ]);
  console.log("DB Campgrounds:", campground);
  return campground;
}

async function fetchPastBookingsByCampgroundId(campgroundId: string) {
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
      $match: {
        "bookings.startDate": {
          $lt: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
      },
    },
    {
      $sort: {
        "bookings.startDate": 1,
      },
    },
  ]);
  console.log("DB Campgrounds:", campground);
  return campground;
}

const BookingRepo = {
  createBooking,
  findBookingById,
  fetchBookingsByUserId,
  fetchFutureBookingsByCampgroundId,
  fetchPastBookingsByCampgroundId
};

export default BookingRepo;
