import axios from "axios";
import { useFormik } from "formik";
import { useToast } from "./contexts/ToastProvider";
import { useTheme } from "./contexts/ThemeProvider";

interface IFormikValues {
  username: string;
  password: string;
  email: string;
}

const usernameRegex = /^[a-zA-Z0-9_-]+$/
// const passwordRegex = 

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length >= 20) {
    errors.username = "Must be less than 20 characters";
  } else if (values.username.length < 3) {
    errors.username = "Must be more than 2 characters"
  } else if(usernameRegex.test(values.username) === false){
    errors.username = "Only hyphens and underscores are allowed"
  }
  
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Must be more than 8 characters";
  } else if(values.password.length > 64){
    errors.password = "A little too much, I'm gonna have to stop you right there (64 max)"
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (values.email.length >= 250) {
    errors.email = "Must be less than 250 characters";
  } else if (values.email.includes(" ")) {
    errors.email = "Email must not have spaces"
  }

  return errors;
};

export default function Register({
  registerState,
  setRegisterState,
  switchForms,
}) {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.register;
  const showToast = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      const response = await axios.post("/api/register", values);
      if (response.status === 200) {
        if (showToast) showToast("Registration sucessful", "green");
        setRegisterState(!registerState);
      }
    },
  });

  return (
    <>
      {registerState && (
        <div
          className={`min-vh-100 d-flex ${styles?.fullpageWrapper}`}
          onClick={() => setRegisterState(!registerState)}
        >
          <div
            className={`container d-flex justify-content-center align-items-center `}
          >
            <div
              className="col-10 col-md-8  col-xl-6 col-xxl-4 mt-3 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`card shadow ${styles?.modalCard}`}>
                <div className={`card-body ${styles.cardForm}`}>
                  <div className="d-flex justify-content-evenly ">
                    <h4
                      onClick={switchForms}
                      className={`card-title ${
                        registerState ? "" : "disabled"
                      } ${styles.loginHeader}`}
                    >
                      Login
                    </h4>
                    <h4 className={`card-title ${styles.registerHeader}`}>
                      Register
                    </h4>
                  </div>
                  <form onSubmit={formik.handleSubmit} className="p-3 mt-0">
                    <div className={`my-3`}>
                      <label
                        className={`form-label py-1 px-0 ${styles.usernameHeader}`}
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        className={`form-control ${styles?.fieldUsername} py-1 px-0`}
                        id="username"
                        type="text"
                        name="username"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        autoFocus
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div style={{ color: "red", textAlign: "start" }}>
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <label
                        className={`form-label py-1 px-0 ${styles.passwordHeader}`}
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        className={`form-control ${styles?.fieldPassword} py-1 px-0`}
                        id="password"
                        type="password"
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: "red", textAlign: "start" }}>
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className={`my-3`}>
                      <label
                        className={`form-label py-1 px-0 ${styles.emailHeader}`}
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={`form-control ${styles?.fieldEmail} py-1 px-0`}
                        id="email"
                        type="text"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        autoFocus
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: "red", textAlign: "start" }}>
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div className="d-grid">
                      <button
                        type="submit"
                        className={`btn ${styles.submitButton}`}
                      >
                        Register
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
