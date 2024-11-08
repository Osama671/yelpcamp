import { useCallback, useEffect, useState } from "react";
import { useUser } from "../components/contexts/UserProvider";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useToast } from "../components/contexts/ToastProvider";
import { useNavigate } from "react-router-dom";
import Campgrounds from "../components/profile/Campgrounds";

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
        console.error(e);
        showToast("User not found", "red");
        navigate("/campgrounds");
      } else {
        showToast("Whoops, something went wrong");
        navigate("/campgrounds");
      }
    }
  }, [user, navigate, showToast]);

  const fetchCampgrounds = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/campgrounds", {
        params: { id: user },
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/bookings", {
        params: { id: user },
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/reviews", {
        params: { id: user },
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  return (
    <>
      {isLoading === true || !userData ? (
        <h1>Loading User Info...</h1>
      ) : (
        <>
          <Navbar />
          <div className="container ">
            <div className=" d-flex justify-content-center ">
              <div className="col-12 col-xl-9">
                <div className="card mt-3 p-3 d-flex flex-row col-12 flex-wrap justify-content-between">
                  <div className="col-12 col-lg-6">
                    <h1 className="text-lg-start text-start">
                      User Information
                    </h1>
                    <div className="d-flex mt-3 ">
                      <h4 className="m-0">Username:&nbsp;</h4>
                      <h5 style={{ padding: "4px" }}>{userData.username}</h5>
                    </div>
                    <div className="d-flex mt-3 flex-wrap">
                      <h4 className="m-0">Email:&nbsp;</h4>
                      <h5 style={{ padding: "4px" }}>{userData.email}</h5>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-lg-0 mt-3 justify-content-end align-items-end">
                    <h1 className="text-lg-end text-start">Change Password</h1>
                    <div className="flex-column d-flex align-items-lg-end">
                      <div className="d-flex justify-content-start justify-content-lg-end mb-2">
                        <div className="">Old Password: &nbsp;</div>
                        <input
                          className="col-6 align-self-stretch"
                          type="password"
                        />
                      </div>
                      <div className="d-flex justify-content-start justify-content-lg-end  mt-3">
                        <div className="">New Password: &nbsp;</div>
                        <input className="col-6" type="password" />
                      </div>
                      <button className="col-8 col-lg-7 align-self-start align-self-lg-end mt-3 btn btn-primary">
                        Change Password
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
              <div onClick={fetchCampgrounds} className="col-4 fs-3 ">
                My Campgrounds
              </div>
              <div onClick={fetchBookings} className="col-4 fs-3">
                Bookings
              </div>
              <div onClick={fetchReviews} className="col-4 fs-3">
                Reviews
              </div>
            </div>
          </div>
          <Campgrounds />
          <Campgrounds />
          <Footer />
        </>
      )}
    </>
  );
}
