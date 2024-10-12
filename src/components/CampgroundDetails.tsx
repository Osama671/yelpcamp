import "../css/stars.css";
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import Carousel from "./reactbootstrap/Carousel.tsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/navbar.module.css";

const mapboxEnv = import.meta.env.VITE_MAPBOX_TOKEN;

const validate = (values) => {
  const errors = {};
  if (!values.review) {
    errors.review = "Required";
  } else if (values.review.length >= 10) {
    errors.review = "Must be less than 10 characters";
  }

  return errors;
};

export default function CampgroundDetails() {
  const [campground, setCampground] = useState({});
  const [currentUser, setCurrentUser] = useState();

  const mapRef = useRef();
  const mapContainerRef = useRef();

  const { id } = useParams();
  const navigate = useNavigate();

  async function getCurrentUser() {
    try {
      const response = await axios.get("/api/auth/getuser");
      setCurrentUser(response.data._id);
    } catch (e) {
      console.error(e);
    }
  }

  async function getCampground() {
    try {
      const response = await axios.get(`/api/campgrounds/${id}`);
      if (response.status !== 200) navigate("/campgrounds");
      setCampground(response.data);
    } catch (e) {
      console.error(e);
      navigate("/campgrounds");
    }
  }

  const deleteCampground = async () => {
    try {
      const response = await axios.delete(`/api/campgrounds/${id}`);
      if (response.status === 200) navigate("/campgrounds");
    } catch (e) {
      console.error(e);
      navigate("/campgrounds");
    }
  };

  const handleDeleteReview = async (reviewid: string) => {
    try {
      const response = await axios.delete(
        `/api/campgrounds/${id}/review/${reviewid}`
      );
      getCampground();
    } catch (e) {
      console.error(e);
    }
  };

  const createMapBox = () => {
    mapboxgl.accessToken = mapboxEnv;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: campground.geometry.coordinates,
      zoom: 9,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    const marker = new mapboxgl.Marker()
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h5>${campground.title}</h5><p>${campground.location}</p>`
        )
      )
      .addTo(mapRef.current);
    return () => {
      mapRef.current.remove();
    };
  };

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 1,
    },
    validate,
    onSubmit: async (values) => {
      const response = await axios.post(
        `/api/campgrounds/${id}/review`,
        values
      );
      getCampground();
    },
  });

  useEffect(() => {
    getCampground();
    getCurrentUser();
  }, [id]);

  useEffect(() => {
    if (campground.geometry?.coordinates) {
      createMapBox();
    }
  }, [campground]);

  return (
    <>
      <Navbar styles={styles} />
      {Object.keys(campground).length === 0 || (
        <main>
          <div className="row m-5">
            <div className=" col-md-6 mt-5">
              <Carousel
                images={campground.images}
                showArrows={campground.images.length === 1 ? false : true}
              />
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{campground.title}</h5>
                  <p className="card-text">{campground.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">{campground.location}</li>
                  <li className="list-group-item">
                    Submitted by: {campground.author.username}
                  </li>
                  <li className="list-group-item">${campground.price}/night</li>
                  <li className="list-group-item">A third item</li>
                </ul>
              </div>
              {campground.author._id == currentUser && (
                <div className="card-body">
                  <Link
                    to={`/campground/${id}/edit`}
                    className="btn btn-info card-link"
                  >
                    Edit Campground
                  </Link>
                  <button
                    onClick={deleteCampground}
                    className="btn btn-danger card-link"
                  >
                    Delete Campground
                  </button>
                </div>
              )}
            </div>
            <div className=" col-md-6 mt-5">
              <div id="map-container" ref={mapContainerRef} className="mb-3" />
              <h2>Reviews:</h2>

              {!currentUser || (
                <form onSubmit={formik.handleSubmit} className="mb-3">
                  <div className="mb-3">
                    <fieldset className="starability-basic ">
                      <input
                        type="radio"
                        id="second-rate1"
                        name="rating"
                        value="1"
                        checked={formik.values.rating === 1}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate1" title="Terrible">
                        1 star
                      </label>

                      <input
                        type="radio"
                        id="second-rate2"
                        name="rating"
                        value="2"
                        checked={formik.values.rating === 2}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate2" title="Not good">
                        2 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate3"
                        name="rating"
                        value="3"
                        checked={formik.values.rating === 3}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate3" title="Average">
                        3 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate4"
                        name="rating"
                        value="4"
                        checked={formik.values.rating === 4}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate4" title="Very good">
                        4 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate5"
                        name="rating"
                        value="5"
                        checked={formik.values.rating === 5}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate5" title="Amazing">
                        5 stars
                      </label>
                    </fieldset>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-4" htmlFor="review">
                      Review
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      cols={30}
                      name="review"
                      id="review"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.review}
                    />
                    {formik.touched.review && formik.errors.review ? (
                      <div style={{ color: "red" }}>{formik.errors.review}</div>
                    ) : null}
                    <button type="submit" className="btn btn-success mt-3">
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
              {campground.reviews.length === 0 && (
                <>
                  <h3 style={{ textAlign: "center" }}>No reviews</h3>{" "}
                  <h5 style={{ textAlign: "center" }}>Be the first to review!</h5>
                </>
              )}

              {Object.keys(campground).length === 0 ||
                campground.reviews.map((review) => (
                  <div className="mb-3 card" key={review._id}>
                    <div className="card-body">
                      <h5>Rating: {review.rating}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        By: {review.author.username}{" "}
                      </h6>
                      <p
                        className="starability-result"
                        data-rating={review.rating}
                      >
                        Rated: 3
                      </p>
                      <p>Review: {review.review}</p>
                      {currentUser !== review.author._id ? null : (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      )}
      <Footer styles={styles} />
    </>
  );
}
