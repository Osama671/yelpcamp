import { Link } from "react-router-dom";

export default function Campgrounds({
  campground,
  checkBookingsToggle,
  fetchBookingsByCampground,
}) {
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3">
          <div className="col-3">
            <Link to={`/campground/${campground._id}`}>
              <img
                className="w-100 rounded"
                style={{
                  objectFit: "fill",
                  maxHeight: "30vh",
                  minHeight: "30vh",
                }}
                src={
                  campground.images.length !== 0
                    ? campground.images[0].url
                    : "https://i.pinimg.com/736x/d6/22/4b/d6224b4bfff79ecc55a028c969d4c8e3.jpg"
                }
              ></img>
            </Link>
          </div>
          <div className="col-9 ">
            <div
              className="d-flex flex-column justify-content-between overflow-x-auto"
              style={{ minHeight: "30vh" }}
            >
              <div className="d-flex flex-row justify-content-between px-4 py-2 text-center fw-bold">
                <div className="col">Title</div>
                <div className="col">Location</div>
                <div className="col">Reviews</div>
                <div className="col">Average Rating</div>
                <div className="col">Upcoming Bookings</div>
              </div>
              <div className="d-flex flex-row align-items-center px-4 py-2 text-center">
                <div
                  className="col "
                  style={{
                    overflow: "auto",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {campground.title}
                </div>
                <div
                  className="col "
                  style={{
                    overflow: "auto",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {campground.location}
                </div>
                <div className="col">{campground.reviews.length}</div>
                <div className="col">Average rating :(</div>
                <div className="col">Upcoming bookings</div>
              </div>
              <div className="d-flex flex-row justify-content-evenly">
                <Link to={`/campground/${campground._id}/edit`}>
                  <button className="btn btn-secondary">Edit Campground</button>
                </Link>
                <button
                  onClick={() => {
                    checkBookingsToggle();
                    fetchBookingsByCampground(campground._id)
                  }}
                  className="btn btn-primary"
                >
                  Check Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
