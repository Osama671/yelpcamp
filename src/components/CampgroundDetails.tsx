import "../css/stars.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import Carousel from "./reactbootstrap/Carousel.tsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ConfirmationModal from "./reactbootstrap/ConfirmationModal.tsx";
import { Campground } from "../../types.ts";
import { useToast } from "./contexts/ToastProvider.tsx";
import ExpressError from "../util/ExpressError.ts";
import { useUser } from "./contexts/UserProvider.tsx";
import { useTheme } from "./contexts/ThemeProvider.tsx";

const mapboxEnv = import.meta.env.VITE_MAPBOX_TOKEN;

interface IFormikValues {
  review: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
  if (!values.review) {
    errors.review = "Required";
  } else if (values.review.length <= 10) {
    errors.review = "Must be greater than 10 characters";
  }
  return errors;
};

export default function CampgroundDetails() {
  const { styles: campgroundStyles, mapboxStyle } = useTheme();
  const styles = campgroundStyles.campgroundDetails;

  const { user } = useUser();
  const showToast = useToast();

  const [campground, setCampground] = useState<Campground | null>(null);

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const getCampground = useCallback(async () => {
    try {
      const response = await axios.get(`/api/campgrounds/${id}`);
      if (response.status !== 200) {
        if (showToast) showToast("Campground does not exist", "red");
        navigate("/campgrounds");
      }
      setCampground(response.data);
    } catch (e) {
      if (e instanceof ExpressError)
        if (e.status) {
          console.error(e);
          if (showToast) showToast("Campground does not exist", "red");
          navigate("/campgrounds");
        }
    }
  }, [id, navigate, showToast]);

  const deleteCampground = async () => {
    try {
      const response = await axios.delete(`/api/campgrounds/${id}`);
      if (response.status === 200) {
        if (showToast) showToast("Campground deleted sucessfully", "green");
        navigate("/campgrounds");
      }
    } catch (e) {
      if (e instanceof ExpressError) {
        console.error(e);
        if (showToast) showToast("Error deleting campground", "red");
        navigate("/campgrounds");
      }
    }
  };

  const handleDeleteReview = async (reviewid: string) => {
    try {
      const response = await axios.delete(
        `/api/campgrounds/${id}/review/${reviewid}`
      );
      if (response.status === 200) {
        if (showToast) showToast("Review deleted sucessfully", "green");
        getCampground();
      }
    } catch (e) {
      if (e instanceof ExpressError) {
        if (showToast) showToast("Error deleting reviewing", "red");
        console.error(e);
      }
    }
  };

  const createMapBox = useCallback(() => {
    if (campground && mapContainerRef.current) {
      const [lng, lat] = campground.geometry.coordinates;
      const newCoord = { lng, lat };

      mapboxgl.accessToken = mapboxEnv;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapboxStyle,
        center: newCoord,
        zoom: 9,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      new mapboxgl.Marker()
        .setLngLat(newCoord)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
          )
        )
        .addTo(mapRef.current);
    }
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [campground, mapboxStyle]);

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 1,
    },
    validate,
    onSubmit: async (values) => {
      try {
        await axios.post(`/api/campgrounds/${id}/review`, values);
        if (showToast) showToast("Review Submitted!", "green");
        getCampground();
      } catch (e) {
        if (e instanceof ExpressError) {
          if (showToast) showToast("Error submitting review", "red");
          console.error(e);
        }
      }
    },
  });

  useEffect(() => {
    getCampground();
  }, [id, getCampground]);

  useEffect(() => {
    if (campground) {
      createMapBox();
    }
  }, [campground, createMapBox]);

  return (
    <>
      <div className={`campgroundsWrapper ${styles.campgroundsWrapper}`}>
        <Navbar  />
        {campground && (
          <main>
            <div className="row mx-2 my-2 mx-md-5 my-md-3 ">
              <div className=" col-lg-6 mt-3">
                <Carousel
                  images={campground.images}
                  showArrows={campground.images.length === 1 ? false : true}
                  styles={styles}
                />
                <div className={` rounded `}>
                  <div className={`card ${styles.cardCategories}`}>
                    <div
                      className={`card-body `}
                    >
                      <h5 className={`card-title fs-3 ${styles.listGroupItem}`}>
                        {campground.title}
                      </h5>
                      <pre
                        className={`card-text ${styles.cardDescription} ${styles.listGroupItem}`}
                      >
                        {campground.description}
                      </pre>
                    </div>
                    <ul
                      className={`list-group list-group-flush `}
                    >
                      <li
                        className={`list-group-item ${styles.listGroupItem} ${styles.cardLocation} `}
                      >
                        Location: {campground.location}
                      </li>
                      <li
                        className={`list-group-item ${styles.listGroupItem} `}
                      >
                        Created by: {campground.author.username}
                      </li>
                      <li
                        className={`list-group-item ${styles.listGroupItem} `}
                      >
                        Price: ${campground.price}/night
                      </li>
                    </ul>

                    {campground.author._id == user && (
                      <div className="card-body p-3 d-flex gap-5 justify-content-center ">
                        <div className="d-flex">
                          <Link
                            to={`/campground/${id}/edit`}
                            className={`btn btn-info card-link ${styles.editCampgroundButton}`}
                          >
                            Edit Campground
                          </Link>
                        </div>
                        <div className="d-flex">
                          <ConfirmationModal
                            func={deleteCampground}
                            modalItems={{
                              buttonText: "Delete Campground",
                              title: "Delete campground",
                              body: "Are you sure you want to delete your campground?",
                              closeButton: "Close",
                              submitButton: "Delete",
                              styles: { styles },
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" col-lg-6 mt-3">
                <div
                  id="map-container"
                  ref={mapContainerRef}
                  className="mb-3"
                />
                <div className={`${styles.reviewWrapper} p-3`}>
                  <h2 className={`${styles.reviewHeader}`}>Reviews:</h2>

                  {!user || (
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
                        <label
                          className={`form-label fs-4 ${styles.reviewHeader}`}
                          htmlFor="review"
                        >
                          Review
                        </label>
                        <textarea
                          className={`form-control ${styles.reviewTextarea} `}
                          rows={5}
                          name="review"
                          id="review"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.review}
                        />
                        {formik.touched.review && formik.errors.review ? (
                          <div style={{ color: "red" }}>
                            {formik.errors.review}
                          </div>
                        ) : null}
                        <button type="submit" className="btn btn-success mt-3">
                          Submit Review
                        </button>
                      </div>
                    </form>
                  )}
                  {campground.reviews.length === 0 && (
                    <>
                      <h3 className={`text-center ${styles.noReviewHeader}`}>
                        No reviews
                      </h3>
                      <h5 className={`text-center ${styles.noReviewHeader}`}>
                        Be the first to review!
                      </h5>
                    </>
                  )}

                  {Object.keys(campground).length === 0 ||
                    campground.reviews.map((review) => (
                      <div
                        className={`mb-3 card ${styles.userReview}`}
                        key={review._id}
                      >
                        <div className={`card-body ${styles.userReviewTitle}`}>
                          <h5>Rating: {review.rating}</h5>
                          <h6
                            className={`card-subtitle mb-2 text-muted ${styles.userReviewTitle}`}
                          >
                            By: {review.author.username}{" "}
                          </h6>
                          <p
                            className="starability-result"
                            data-rating={review.rating}
                          >
                            Rated: 3
                          </p>
                          <pre className={` ${styles.userReviewContent}`}>
                            {review.review}
                          </pre>
                          {user !== review.author._id ? null : (
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className={`btn btn-sm btn-danger ${styles.reviewDeleteButton}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </main>
        )}
        <Footer />
      </div>
    </>
  );
}
