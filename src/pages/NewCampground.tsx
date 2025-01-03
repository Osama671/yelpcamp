import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import LocationPicker from "../components/LocationPicker";
import { useToast } from "../components/contexts/ToastProvider";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/contexts/ThemeProvider";

interface IFormikValues {
  title: string;
  location: string;
  price: number | string;
  description: string;
  images: Express.Multer.File[];
}

interface IErrorValues extends Omit<IFormikValues, "images"> {
  images: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as IErrorValues;
  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length <= 8) {
    errors.title = "Title too short!";
  } else if (values.title.length >= 100) {
    errors.title = "Title too long!";
  }

  if (!values.location) {
    errors.location = "Required";
  } else if (values.location.length <= 8) {
    errors.location = "Location too short!";
  } else if (values.location.length >= 150) {
    errors.location = "Location too long!";
  }

  if (!values.price) {
    errors.price = "Required";
  } else if (+values.price <= 0) {
    errors.price = "Must be greater than 0";
  } else if (+values.price > 1000000) {
    errors.price = "A tad bit much for a campground (Max: 1,000,000)";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length <= 30) {
    errors.description = "Be a bit more descriptive!";
  } else if (values.description.length > 1500) {
    errors.description = "Too many characters! (Max: 1,500)";
  }
  return errors;
};

export default function NewCampground() {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.newCampground;
  const showToast = useToast();

  const navigate = useNavigate();

  const [disableButton, setDisableButton] = useState(false);

  const [marker, setMarker] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });

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
      try {
        if (disableButton === true) {
          if (showToast)
            showToast("Your request is being processed...", "orange");
          return;
        }
        setDisableButton(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("location", values.location);
        formData.append("price", values.price);
        for (let i = 0; i < values.images.length; i++) {
          formData.append("images", values.images[i]);
        }
        formData.append("description", values.description);
        formData.append("longitude", String(marker.longitude));
        formData.append("latitude", String(marker.latitude));
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        const response = await axios.post("/api/campgrounds", formData);
        if (response.status === 200) {
          if (showToast) showToast("Campground Created", "green");
          navigate(`/campground/${response.data.campgroundId}`);
        }
      } catch (e) {
        if (showToast) showToast("Something went wrong...", "red");
        setDisableButton(true);
      }
    },
  });

  bsCustomFileInput.init();

  return (
    <>
      <Navbar />
      <div className={`${styles.newCampgroundWrapper}`}>
        <div
          className={`col-10 offset-1 col-md-8 offset-md-2 ${styles.formColumn}`}
        >
          <div className={`${styles.formWrapper}`}>
            <h1 className={`text-center ${styles.formHeader}`}>
              Create a new Campground
            </h1>
            <hr />
            <div className="card-body">
              <form
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label
                    className={`form-label fw-medium fs-3 ${styles.formTitleHeader}`}
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className={`form-control ${styles.formTitleInput}`}
                    id="title"
                    type="text"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label
                    className={`form-label fw-medium fs-3 ${styles.formLocationHeader}`}
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    className={`form-control ${styles.formLocationInput}`}
                    id="location"
                    type="text"
                    name="location"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.location}
                  />
                  {formik.touched.location && formik.errors.location ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.location}
                    </div>
                  ) : null}
                </div>
                <LocationPicker
                  marker={marker}
                  onMapClick={setMarker}
                  styles={styles}
                />
                <label
                  className={`form-label mt-3 fw-medium fs-3 ${styles.formPriceHeader}`}
                  htmlFor="price"
                >
                  Price
                </label>
                <div className="input-group">
                  <span className={`input-group-text ${styles.formPriceInput}`}>
                    $
                  </span>
                  <input
                    placeholder="0.00"
                    type="text"
                    className={`form-control ${styles.formPriceInput}`}
                    aria-label="Amount (to the nearest dollar)"
                    id="price"
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  />
                </div>
                {formik.touched.price && formik.errors.price ? (
                  <div style={{ color: "red" }} className="fw-medium">
                    {formik.errors.price}
                  </div>
                ) : null}
                <div className="mb-3 mt-3">
                  <div className=" custom-file">
                    <label
                      htmlFor="images"
                      className={`form-label custom-file-label fw-medium fs-3 ${styles.formImagesHeader}`}
                    >
                      {formik.values.images.length === 0
                        ? "Upload Images"
                        : null}
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className={`form-control ${styles.formImageInput}`}
                      multiple
                      onChange={(event) => {
                        formik.setFieldValue("images", event.target.files);
                      }}
                    ></input>
                  </div>
                  {formik.touched.images && formik.errors.images ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.images}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label
                      className={`form-label fw-medium fs-3 ${styles.formDescriptionHeader}`}
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <p
                      className="align-self-center m-0"
                      style={{
                        color:
                          formik.values.description.length === 0
                            ? "black"
                            : formik.values.description.length > 30 &&
                              formik.values.description.length <= 1500
                            ? "green"
                            : "red",
                      }}
                    >
                      {formik.values.description.length}/1500
                    </p>
                  </div>
                  <textarea
                    className={`form-control ${styles.textarea}`}
                    rows={6}
                    id="description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  ></textarea>
                  {formik.touched.description && formik.errors.description ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className={`btn btn-success mt-3 p-3 fs-5 fw-medium ${styles.submitButton}`}
                    type="submit"
                  >
                    Create Campground
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
