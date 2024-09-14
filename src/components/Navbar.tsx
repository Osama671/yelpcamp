import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [getUser, setGetUser] = useState(undefined);

  const handleLogout = async () => {
    const response = await axios.get("/api/logout");
  };

  useEffect(() => {
    async function fetchUser() {
      const response = await axios.get("/api/auth/getuser");
      setGetUser(response.data.username);
    }
    fetchUser();
  }, []);

  return (
    <>
      <nav
        className="navbar sticky-top navbar-expand-lg bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
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
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/campgrounds"
                >
                  Campgrounds
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/newcampground"
                >
                  New Campgrounds
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-nav ml-auto ">
            {getUser || (
              <>
                <li className="nav-link">
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-link">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {getUser && (
              <li className="nav-link" onClick={handleLogout}>
                <Link to="/login">Logout</Link>
              </li>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
