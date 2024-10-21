import axios from "axios";
import { Link } from "react-router-dom";
import { useToast } from "./contexts/ToastProvider";
import { useUser } from "./contexts/UserProvider";
import { useTheme } from "./contexts/ThemeProvider";

export default function Navbar({
  stylesProp,
}: {
  stylesProp?: CSSModuleClasses;
}) {
  const { changeTheme, styles: campgroundStyles } = useTheme();
  const navbarStyle = campgroundStyles.navbar;

  const styles = stylesProp || navbarStyle; //If no styles is passed as props, then use useTheme() navbar styles.
  console.log(styles);
  const showToast = useToast();
  const { removeUser, user } = useUser();

  const handleLogout = async () => {
    const response = await axios.get("/api/logout");
    if (response.status === 200) {
      if (showToast) showToast("Logout sucessful!", "green");
      removeUser();
    }
  };

  return (
    <>
      <nav
        className={`${styles.navbar}  navbar sticky-top navbar-expand-lg bg-body-tertiary mt-3`}
        data-bs-theme="dark"
      >
        <div className="container-fluid d-flex gap-3 ">
          <Link className="navbar-brand" to="/">
            Yelpcamp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className={`navbar-nav ${styles.navbarNav}`}>
              <li className={`nav-item ${styles.navItem}`}>
                <Link className={`${styles.navLink} active`} to="/campgrounds">
                  Campgrounds
                </Link>
              </li>
              <li className={`nav-item ${styles.navItem}`}>
                <Link
                  className={`${styles.navLink} active`}
                  to="/newcampground"
                >
                  New Campgrounds
                </Link>
              </li>
            </ul>
          </div>
          <div
            className="collapse navbar-collapse ml-auto justify-content-end"
            id="navbarNav"
          >
            {!user ? (
              <>
                <ul className={`navbar-nav ${styles.navbarNav}`}>
                  <li className={`nav-item ${styles.navItem}`}></li>
                  <li className={`nav-item ${styles.navItem}`}>
                    <Link
                      to="/login"
                      className={`${styles.navLink} active`}
                      aria-current="page"
                    >
                      Login
                    </Link>
                  </li>
                  <li className={`nav-item ${styles.navItem}`}>
                    <Link
                      to="/register"
                      className={`${styles.navLink} active`}
                      aria-current="page"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <ul className={`navbar-nav ${styles.navbarNav}`}>
                <li className={`nav-item ${styles.navItem}`}>
                  <Link
                    to=""
                    className={`${styles.navLink} active `}
                    aria-current="page"
                    onClick={() => changeTheme()}
                  >
                    Switch Theme
                  </Link>
                </li>
                <li className={`nav-item ${styles.navItem}`}>
                  <Link
                    to="/profile"
                    className={`${styles.navLink} active `}
                    aria-current="page"
                  >
                    Profile
                  </Link>
                </li>
                <li className={`nav-item ${styles.navItem}`}>
                  <Link
                    to="/login"
                    onClick={handleLogout}
                    className={`${styles.navLink} active`}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
