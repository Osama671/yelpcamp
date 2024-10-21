import mongoose from "mongoose";

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
  const newBooking = new Booking({
    startDate: startDate,
    endDate: endDate,
    author: userId,
    campground: campgroundId,
  });
  await newBooking.save();
}

const BookingRepo = {
  createBooking,
};

export default BookingRepo;
