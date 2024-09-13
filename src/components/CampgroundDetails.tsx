import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteCampground = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}`);
    if (response.status === 200) navigate("/campgrounds");
  };

  const handleSubmitReview = async () => {
    const response = await axios.post(`/api/campgrounds/${id}/review`);
    if (response.status === 200) navigate(`campground/${id}`);
  };

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validate,
    onSubmit: async (values) => {
      
      const response = await axios.post(
        `/api/campgrounds/${id}/review`,
        values
      );
      navigate("/campgrounds");
      console.log(response.status);
      
    },
  });

  useEffect(() => {
    async function getCampground() {
      const response = await axios.get(`/api/campgrounds/${id}`);
      setCampground(response.data);
    }
    getCampground();
  }, [id]);
  return (
    <>
      <Navbar />
      <main>
        <div className="row">
          <div className="col-6 offset-3">
            <div className="card">
              <img src={campground.image} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{campground.title}</h5>
                <p className="card-text">{campground.description}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">{campground.location}</li>
                <li className="list-group-item">${campground.price}/night</li>
                <li className="list-group-item">A third item</li>
              </ul>
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
              <div className="card-footer text-body-secondary">
                <Link to="/campgrounds">All Campgrounds </Link>
              </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="mb-3">
              <h2>Leave a review</h2>
              <div className="mb-3">
                <label className="form-label" htmlFor="rating">
                  Rating
                </label>
                <input
                  className="form-range"
                  type="range"
                  min={1}
                  max={5}
                  name="rating"
                  id="rating"
                ></input>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="review">
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
                <button type="submit" className="btn btn-success">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
