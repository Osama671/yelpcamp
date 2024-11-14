import { Link } from "react-router-dom";

export default function Bookings({ booking }) {
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3">
          <div className="col-3">
            <Link to={`/campground/${booking.campground._id}`}>
              <img
                className="w-100 rounded"
                style={{
                  objectFit: "fill",
                  maxHeight: "30vh",
                  minHeight: "30vh",
                }}
                src={
                  booking.campground.images.length !== 0
                    ? booking.campground.images[0].url
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
                <div className="col">Campground</div>
                <div className="col">Location</div>
                <div className="col">Start Date</div>
                <div className="col">End Date</div>
              </div>
              <div className="d-flex flex-row align-items-center px-4 py-2 text-center">
                <div
                  className="col"
                  style={{
                    overflow: "hidden",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {booking.campground.title}
                </div>
                <div className="col"
                 style={{
                    overflow: "hidden",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {booking.campground.location}
                </div>
                <div className="col">{booking.startDate.split('T')[0]}</div>
                <div className="col">{booking.endDate.split('T')[0]}</div>
              </div>
              <Link to={`/campground/${booking.campground._id}`}>
              <div className="d-flex flex-row justify-content-evenly">
                <button className="btn btn-secondary">Check Campground</button>
              </div></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
