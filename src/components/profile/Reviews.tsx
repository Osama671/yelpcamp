import { Link } from "react-router-dom";

export default function Reviews({ review }) {
  return (
    <>
      {console.log("REVIEW:", review)}
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3">
          <div className="col-3">
            <Link to={`/campground/${review.campground._id}`}>
              <img
                className="w-100 rounded"
                style={{
                  objectFit: "fill",
                  maxHeight: "30vh",
                  minHeight: "30vh",
                }}
                src={
                  review.campground.images.length !== 0
                    ? review.campground.images[0].url
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
              <div className="d-flex flex-row  px-4 py-2 text-center fw-bold">
                <div className="col-3">Campground</div>
                <div className="col-2">Rating</div>
                <div className="col-7">Review</div>
              </div>
              <div className="d-flex flex-row px-4 py-2 align-items-center text-center">
                <div
                  className="col-3"
                  style={{
                    overflow: "hidden",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {review.campground.title}
                </div>
                <div
                  className="col-2"
                  style={{
                    overflow: "hidden",
                  }}
                >
                  {review.rating}
                </div>
                <div
                  className="col-7"
                  style={{
                    overflow: "auto",
                    whiteSpace: "normal",
                    maxHeight: "25vh",
                  }}
                >
                  {review.review}
                </div>
              </div>
              <Link to={`/campground/${review.campground._id}`}>
                <div className="d-flex flex-row justify-content-evenly">
                  <button className="btn btn-secondary">
                    Check Campground
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
