import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeProvider";

export default function Reviews({ review }) {
  const { styles: profileCampgroundStyle } = useTheme();
  const styles = profileCampgroundStyle.profileReviews;
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className={`card flex-row d-flex col-12 p-3 flex-wrap ${styles.reviewWrapper}`}>
          <div className="col-lg-3 col-12">
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
          <div className="col-12 col-lg-9 my-3 mt-lg-0 flex-wrap">
            <div
              className="d-flex flex-column justify-content-between "
              style={{ minHeight: "30vh" }}
            >
              <div
                className={`flex-column d-flex justify-content-evenly ${styles.reviewsInfo}`}
                style={{ minHeight: "20vh" }}
              >
                <div className="d-flex flex-row  px-4 py-2 text-center fw-bold">
                  <div className={`col-lg-3 col-4 ${styles.campgroundHeader}`}>Campground</div>
                  <div className={`col-lg-2 col-4 ${styles.ratingHeader}`}>Rating</div>
                  <div className={`col-lg-7 col-8 ${styles.reviewHeader}`}>Review</div>
                </div>
                <div className="d-flex flex-row px-4 py-2 align-items-center text-center">
                  <div
                    className={`col-lg-3 col-4 ${styles.campgroundContent}`}
                    style={{
                      overflow: "hidden",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {review.campground.title}
                  </div>
                  <div
                    className={`col-lg-2 col-4 ${styles.ratingContent}`}
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    {review.rating}
                  </div>
                  <div
                    className={`col-lg-7 col-8 ${styles.reviewContent}`}
                    style={{
                      overflow: "auto",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {review.review}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-evenly mt-3">
                <Link
                  to={`/campground/${review.campground._id}`}
                >
                  <button className="btn btn-success">Check Campground</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
