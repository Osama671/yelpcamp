import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/contexts/ToastProvider";
import { useUser } from "../components/contexts/UserProvider";
import { useTheme } from "../components/contexts/ThemeProvider";
import Login from "./Login";

interface IFormikValues {
  username: string;
  password: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
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

  return errors;
};

export default function NewLogin({ LoginState, setLoginState, switchForms }) {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.login;
  const showToast = useToast();
  const { getUser } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      const response = await axios.post("/api/login", values);
      console.log("Response", response);
      console.log(response.status);
      if (response.status === 200) {
        if (showToast) showToast("Login sucessful", "green");
        getUser();
        setLoginState(!LoginState)
        navigate("/campgrounds");
      }
    },
  });

  return (
    <>
      {LoginState && (
        <div
          className={`min-vh-100 d-flex ${styles.fullpageWrapper}`}
          onClick={() => setLoginState(!LoginState)}
        >
          <div
            className={`container d-flex justify-content-center align-items-center `}
          >
            <div
              className="col-8 col-lg-4 mt-3 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card shadow">
                <div className={`card-body ${styles.loginCard}`}>
                  <div className="d-flex justify-content-evenly ">
                    <h4 className="card-title  ">Login</h4>
                    <h4 onClick={switchForms}
                      className={`card-title ${
                        LoginState ? "" : "disabled"
                      } `}
                    >
                      Register
                    </h4>
                  </div>
                  <form onSubmit={formik.handleSubmit} className="p-3 mt-0">
                    <div className={`my-3`}>
                      <label
                        className="form-label py-1 px-0"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        className={`form-control ${styles.fieldUsername} py-1 px-0`}
                        id="username"
                        type="text"
                        name="username"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        autoFocus
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label py-1 px-0"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        className={`form-control ${styles.fieldPassword} py-1 px-0`}
                        id="password"
                        type="password"
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-success">
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
