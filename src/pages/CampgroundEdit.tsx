import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import { Campground } from "../../types";
import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import LocationPicker from "../components/LocationPicker";
import Navbar from "../components/Navbar";
import { useToast } from "../components/contexts/ToastProvider";
import { useUser } from "../components/contexts/UserProvider";
import { useTheme } from "../components/contexts/ThemeProvider";
import Loader from "../components/Loader";

interface IFormikValues {
  title: string;
  location: string;
  price: string | number;
  description: string;
}

const priceRegex = /^(?!0\d)\d+(\.\d{1,2})?$/;

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
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
  } else if (String(values.price).includes(".")) {
    if (String(values.price).split(".")[1].length > 2) {
      errors.price = "Price must be up to two decimal places";
    }
  } else if (priceRegex.test(String(values.price)) === false) {
    errors.price = "Price can only have numbers";
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

export default function CampgroundEdit() {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.editCampground;
  const showToast = useToast();
  const { user } = useUser();
  const [campground, setCampground] = useState<Campground | null>(null);

  const [mapLoading, setMapLoading] = useState(true);

  const [marker, setMarker] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const [disableButton, setDisableButton] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const getCampgroundInfo = useCallback(async () => {
    const info = await axios.get(`/api/campgrounds/${id}/edit`);
    setCampground(info.data);
    const [longitude, latitude] = info.data.geometry.coordinates;
    setMarker(() => ({ latitude: latitude, longitude: longitude }));
    setMapLoading(false);
  }, [id]);

  useEffect(() => {
    getCampgroundInfo();
  }, [id, getCampgroundInfo]);

  const formik = useFormik({
    initialValues: {
      title: campground?.title || "",
      location: campground?.location || "",
      price: campground?.price || "",
      images: [],
      description: campground?.description || "",
      deleteImages: [],
    },
    enableReinitialize: true,
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
        formData.append("price", String(values.price));
        for (let i = 0; i < values.images.length; i++) {
          formData.append("images", values.images[i]);
        }
        formData.append("longitude", String(marker.longitude));
        formData.append("latitude", String(marker.latitude));
        formData.append("description", values.description);
        for (let i = 0; i < values.deleteImages.length; i++) {
          formData.append("deleteImages", values.deleteImages[i]);
        }

        const response = await axios.post(
          `/api/campgrounds/${id}/edit`,
          formData
        );

        if (response.status === 200) {
          if (showToast) showToast("Campground edited sucessfully", "green");
          navigate(`/campground/${id}`);
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
      <div className={`${styles.newCampgroundWrapper}`}>
        {!campground ? (
          <Loader loadingMessage={"Loading Edit Campground..."} />
        ) : (
          <>
            {campground.author._id !== user ? (
              <Navigate to="/campgrounds" />
            ) : (
              <>
                <Navbar />
                <div
                  className={`col-10 offset-1 col-md-8 offset-md-2 ${styles.formColumn}`}
                >
                  <div className={`${styles.formWrapper}`}>
                    <h1 className={`text-center ${styles.formHeader}`}>
                      Edit Campground
                    </h1>
                    <hr />
                    <div className="col-12">
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
                            placeholder={campground.title}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.title}
                          />
                          {formik.touched.title && formik.errors.title ? (
                            <div style={{ color: "red" }}>
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
                            placeholder={campground.location}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.location}
                          />
                          {formik.touched.location && formik.errors.location ? (
                            <div style={{ color: "red" }}>
                              {formik.errors.location}
                            </div>
                          ) : null}
                        </div>
                        {!mapLoading && (
                          <LocationPicker
                            marker={marker}
                            onMapClick={setMarker}
                            styles={styles}
                          />
                        )}
                        <label
                          className={`form-label mt-3 fw-medium fs-3 ${styles.formPriceHeader}`}
                          htmlFor="price"
                        >
                          Price
                        </label>

                        <div className="input-group">
                          <span
                            className={`input-group-text ${styles.formPriceInput}`}
                          >
                            $
                          </span>
                          <input
                            type="text"
                            className={`form-control ${styles.formPriceInput}`}
                            aria-label="Amount (to the nearest dollar)"
                            id="price"
                            name="price"
                            placeholder={String(campground.price)}
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
                            id="description"
                            name="description"
                            rows={4}
                            placeholder={campground.description}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                          ></textarea>
                          {formik.touched.description &&
                          formik.errors.description ? (
                            <div style={{ color: "red" }}>
                              {formik.errors.description}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3 ">
                          <div className="mb-3 custom-file">
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
                                formik.setFieldValue(
                                  "images",
                                  event.target.files
                                );
                              }}
                            ></input>
                          </div>
                          {formik.touched.images && formik.errors.images ? (
                            <div style={{ color: "red" }}>
                              {formik.errors.images}
                            </div>
                          ) : null}
                        </div>
                        <div className="container justify-content-center p-0">
                          <div
                            className="row "
                            style={{ overflowY: "auto", maxHeight: "100vh" }}
                          >
                            {campground.images.map((image) => (
                              <>
                                <div className="col-lg-6 col-12">
                                  <div
                                    className="my-3"
                                    style={{ height: "250px" }}
                                    key={image._id}
                                  >
                                    <img
                                      src={image.url}
                                      className={`w-100 h-100 object-fit-fill ${styles.deleteImage}`}
                                      key={image._id}
                                    ></img>
                                  </div>
                                  <div className="d-flex form-check-inline gap-3 ">
                                    <input
                                      name="deleteImages"
                                      type="checkbox"
                                      onChange={formik.handleChange}
                                      value={image.filename || image.url}
                                    />
                                    <label
                                      className={`${styles.deleteImageLabel}`}
                                      htmlFor="deleteImages"
                                    >
                                      Delete?
                                    </label>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                          <button
                            className={`btn btn-success  p-3 fs-5 fw-medium ${styles.submitButton}`}
                            type="submit"
                          >
                            Edit Campground
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
