import { useCallback, useEffect, useState } from "react";
import { useUser } from "../components/contexts/UserProvider";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useToast } from "../components/contexts/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get("/api/user", { params: { id: user } });
      setUserData(response.data);
      setIsLoading(false);
    } catch (e) {
      if (e.status === 401) {
        showToast("User not found", "red");
        navigate("/campgrounds");
      } else {
        showToast("Whoops, something went wrong");
        navigate("/campgrounds");
      }
    }
  }, [user, navigate, showToast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  console.log(user);
  return (
    <>
      {isLoading === true || !userData ? (
        <h1>Loading User Info...</h1>
      ) : (
        <>
          <Navbar />
          <div className="container ">
            <div className="flex-column d-flex justify-content-center align-items-center">
              <div className="col-12 col-xl-6">
                <div className="card mt-3 p-3">
                  <h1 className="text-center">User Information</h1>
                  <div className="d-flex mt-3 ">
                    <h3 className="m-0">Username:&nbsp;</h3>
                    <h5 style={{ padding: "4px" }}>Ayayayaa</h5>
                  </div>
                  <div className="d-flex mt-3">
                    <h3 className="m-0">Email:&nbsp;</h3>
                    <h5 style={{ padding: "4px" }}>Ayayayaa@hotmail.com</h5>
                  </div>
                </div>
                <div className="card mt-3 p-3">
                  <h1 className="text-center">Change Password</h1>
                  <div className="flex-column d-flex">
                    <div className="d-flex flex-row mb-2">
                      <div className="col-md-auto">Old Password: &nbsp;</div>
                      <input className="col-3" type="password" />
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="col-md-auto">New Password: &nbsp;</div>
                      <input className="col-3" type="password" />
                    </div>
                    <div>
                      <button className="mt-3 btn btn-primary col-6">
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="container my-3 text-center">
            <div className="row justify-content-between">
              <div className="col-4 fs-3 ">My Campgrounds</div>
              <div className="col-4 fs-3">Bookings</div>
              <div className="col-4 fs-3">Reviews</div>
            </div>
          </div>
          <div>
            <h1 className="text-center m-5">INFO FROM COMPONENTS/PROFILE</h1>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
