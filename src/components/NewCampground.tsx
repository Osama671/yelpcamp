import { Link, useNavigate } from "react-router-dom";
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

  if (!values.images || values.images.length === 0) {
    errors.images = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description <= 5) {
    errors.description = "Be a bit more descriptive!";
  }
  return errors;
};

export default function NewCampground() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      location: "",
      price: "",
      images: [], 
      description: "",
    },
    validate,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("location", values.location);
      formData.append("price", values.price);
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      formData.append("description", values.description);
      // for (let [key, value] of formData){
      //   console.log(key, value)
      // }      
      const response = await axios.post("/api/campgrounds", formData);
      if (response) navigate("/campgrounds");
    },
  });

  return (
    <>
      <h1 className="text-center">New Campground:</h1>
      <p className="text-center">
        <Link to="/">Home Page</Link>
      </p>
      <div className="col-6 offset-3">
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              className="form-control"
              id="title"
              type="text"
              name="title"
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
              placeholder="0.00"
              type="text"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              id="price"
              name="price"
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
          <div className="mb-3 mt-3">
            <label className="form-label" htmlFor="images">
              Upload Images
            </label>
            <input
              id="images"
              name="images"
              type="file"
              className="form-control"
              multiple // Allow multiple files
              onChange={(event) => {
                formik.setFieldValue("images", event.target.files);
              }}
            />
            {formik.touched.images && formik.errors.images ? (
              <div style={{ color: "red" }}>{formik.errors.images}</div>
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
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div style={{ color: "red" }}>{formik.errors.description}</div>
            ) : null}
          </div>
          <button type="submit">Add Campground</button>
        </form>
      </div>

      <div className="col-6 offset-3">
        <br />
      </div>
    </>
  );
}