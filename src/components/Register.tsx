import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length >= 10) {
    errors.username = "Must be less than 10 characters";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length >= 10) {
    errors.password = "Must be less than 10 characters";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (values.email.length >= 30) {
    errors.email = "Must be less than 30 characters";
  }

  return errors;
};

export default function Register() {
    const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      const response = await axios.post("/api/register", values);
      navigate("/campgrounds")
    },
  });

  return (
    <>
      <div className="col-6 offset-3 mt-3">
        <h1>Register</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="my-3">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-control"
              id="username"
              type="text"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div style={{ color: "red" }}>{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              id="password"
              type="password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              id="email"
              type="email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}