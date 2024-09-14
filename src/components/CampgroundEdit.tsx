import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length >= 10) {
    errors.title = "Must be less than 10 characters";
  }

  if (!values.location) {
    errors.location = "Required";
  } else if (values.location.length >= 10) {
    errors.location = "Must be less than 10 characters";
  }

  if (!values.price) {
    errors.price = "Required";
  } else if (values.price <= 0) {
    errors.price = "Must be greater than 0";
  }

  if (!values.imageurl) {
    errors.imageurl = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description <= 5) {
    errors.description = "Be a bit more descriptive!";
  }
  return errors;
};

export default function CampgroundEdit() {
  const [campground, setCampground] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  async function getCurrentUser() {
    const response = await axios.get("/api/auth/getuser");
    setCurrentUser(response.data._id);
  }

  async function getCampgroundInfo() {
    const info = await axios.get(`/api/campgrounds/${id}/edit`);
    setCampground(info.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getCurrentUser();
    getCampgroundInfo();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      location: "",
      price: "",
      imageurl: "",
      description: "",
    },
    validate,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      const response = await axios.post(`/api/campgrounds/${id}/edit`, values);
      console.log(response.status);
      if (response.status === 200) {
        navigate(`/campground/${id}`);
      }
    },
  });

  return (
    <>
      {isLoading ? null : (
        <>
          {console.log("campground.author:", campground.author._id)}
          {console.log("currentUser:", currentUser)}
          {campground.author._id !== currentUser ? (
            <Navigate to="/campgrounds" />
          ) : (
            <>
              <h1 className="text-center">Edit Campground:</h1>
      <p className="text-center"></p>
      <div className="col-6 offset-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              className="form-control"
              id="title"
              type="text"
              name="title"
              placeholder={campground.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div style={{ color: "red" }}>{formik.errors.title}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              className="form-control"
              id="location"
              type="text"
              name="location"
              placeholder={campground.location}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.location}
            />
            {formik.touched.location && formik.errors.location ? (
              <div style={{ color: "red" }}>{formik.errors.location}</div>
            ) : null}
          </div>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              id="price"
              name="price"
              placeholder={campground.price}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.price}
            />
          </div>
          {formik.touched.price && formik.errors.price ? (
            <div style={{ color: "red", marginBottom: "1em" }}>
              {formik.errors.price}
            </div>
          ) : null}
          <div className="mb- mt-3">
            <label className="form-label" htmlFor="imageurl">
              Image Url
            </label>
            <input
              className="form-control"
              id="imageurl"
              type="text"
              name="imageurl"
              placeholder={campground.image}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.imageurl}
            />
            {formik.touched.price && formik.errors.price ? (
              <div style={{ color: "red" }}>{formik.errors.price}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder={campground.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div style={{ color: "red" }}>{formik.errors.description}</div>
            ) : null}
          </div>
          <button className="btn btn-info" type="submit">
            Update Campground
          </button>
        </form>
        <div className="mt-3">
          <Link to="/campgrounds">Back to Campgrounds</Link>
        </div>
      </div>
            </>
          )}
        </>
      )}
    </>
  );
}
