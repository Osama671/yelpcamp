import { useCallback, useEffect, useState } from "react";
import { useUser } from "../components/contexts/UserProvider";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useToast } from "../components/contexts/ToastProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import Campgrounds from "../components/profile/Campgrounds";
import Bookings from "../components/profile/Bookings";
import Reviews from "../components/profile/Reviews";
import RedirectBox from "../components/profile/RedirectBox";
import { useTheme } from "../components/contexts/ThemeProvider";
import Pagination from "../components/Pagination";
import { Booking, Campground, Review } from "../../types";
import FutureBookings from "../components/profile/checkbookings/FutureBookings";
import PastBookings from "../components/profile/checkbookings/PastBookings";

interface IAllData {
  data: Campground[] | Review[] | Booking[];
  dataCount: number;
  dataType: string;
}

export default function Profile() {
  const { styles: profileStyles } = useTheme();
  const styles = profileStyles.profile;

  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fetchedData, setFetchedData] = useState<IAllData>({
    data: [],
    dataCount: 0,
    dataType: "",
  });
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [pageCount, setPageCount] = useState(1);
  const cardPerPage = 4;

  const [, setSearchParams] = useSearchParams();

  const [showFutureBookings, setFutureBookings] = useState(false);
  const [showPastBookings, setShowPastBookings] = useState(false);

  const [campgroundBookings, setCampgroundBookings] = useState([])

  const switchForms = () => {
    setFutureBookings(!showFutureBookings);
    setShowPastBookings(!showPastBookings);
  };

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
        params: { id: user, page: pageCount, productsPerPage: cardPerPage },
      });
      const { campgrounds } = response.data;
      setFetchedData({
        data: campgrounds,
        dataCount: response.data.count,
        dataType: "campgrounds",
      });
    } catch (e) {
      console.error(e);
    }
  }, [user, pageCount]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/bookings", {
        params: { id: user, page: pageCount, productsPerPage: cardPerPage },
      });
      const { bookings } = response.data;
      setFetchedData({
        data: bookings,
        dataCount: response.data.count,
        dataType: "bookings",
      });
    } catch (e) {
      console.error(e);
    }
  }, [user, pageCount]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/reviews", {
        params: { id: user, page: pageCount, productsPerPage: cardPerPage },
      });
      const { reviews } = response.data;
      setFetchedData({
        data: reviews,
        dataCount: response.data.count,
        dataType: "reviews",
      });
    } catch (e) {
      console.error(e);
    }
  }, [user, pageCount]);

  const setPageNumInURL = useCallback(() => {
    setSearchParams({ page: `${pageCount}` });
  }, [pageCount, setSearchParams]);

  const onPageChange = (num: number) => {
    setPageCount(num);
  };

  const callAPIAgain = useCallback(async () => {
    if (fetchedData.dataType === "campgrounds") fetchCampgrounds();
    if (fetchedData.dataType === "bookings") fetchBookings();
    if (fetchedData.dataType === "reviews") fetchReviews();
  }, [fetchCampgrounds, fetchBookings, fetchReviews, fetchedData.dataType]);

  const fetchFutureBookingsByCampground = async (campgroundId: string) => {
    const response = await axios.get(`/api/booking/${campgroundId}/future`)
    setCampgroundBookings(response.data)
  }

  const fetchPastBookingsByCampground = async (campgroundId: string) => {
    const response = await axios.get(`/api/booking/${campgroundId}/past`)
    setCampgroundBookings(response.data)
  }

  useEffect(() => {
    setPageNumInURL();
    callAPIAgain();
  }, [setPageNumInURL, callAPIAgain]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  return (
    <>
      {isLoading === true || !userData ? (
        <h1>Loading User Info...</h1>
      ) : (
        <>
        {console.log(campgroundBookings)}
          <FutureBookings
            futureBookingsState={showFutureBookings}
            setFutureBookingsState={setFutureBookings}
            switchForms={switchForms}
            campgrounds={campgroundBookings}
          />
          <PastBookings
            pastBookingsState={showPastBookings}
            setPastBookingsState={setShowPastBookings}
            switchForms={switchForms}
          />
          <div className={`${styles.profileWrapper}`}>
            <Navbar />
            <div className={` container ${styles.profileContainer}`}>
              <div className={`container `}>
                <div className=" d-flex justify-content-center ">
                  <div className="col-12 col-xl-9">
                    <div className="card mt-3 p-3 d-flex flex-row col-12 flex-wrap justify-content-between">
                      <div className="col-12 col-lg-6">
                        <h1 className="text-lg-start text-start">
                          User Information
                        </h1>
                        <div className="d-flex mt-3 ">
                          <h4 className="m-0">Username:&nbsp;</h4>
                          <h5 style={{ padding: "4px" }}>
                            {userData.username}
                          </h5>
                        </div>
                        <div className="d-flex mt-3 flex-wrap">
                          <h4 className="m-0">Email:&nbsp;</h4>
                          <h5 style={{ padding: "4px" }}>{userData.email}</h5>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 mt-lg-0 mt-3 justify-content-end align-items-end">
                        <h1 className="text-lg-end text-start">
                          Change Password
                        </h1>
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
                  <div className="col-4 ">
                    <h3
                      style={{ display: "inline" }}
                      className="fw-bold"
                      onClick={() => {
                        setPageCount(1);
                        fetchCampgrounds();
                      }}
                    >
                      My Campgrounds
                    </h3>
                  </div>
                  <div className="col-4 ">
                    <h3
                      style={{ display: "inline" }}
                      className="fw-bold "
                      onClick={() => {
                        setPageCount(1);
                        fetchBookings();
                      }}
                    >
                      Bookings
                    </h3>
                  </div>
                  <div className="col-4">
                    <h3
                      style={{ display: "inline" }}
                      className="fw-bold"
                      onClick={() => {
                        setPageCount(1);
                        fetchReviews();
                      }}
                    >
                      Reviews
                    </h3>
                  </div>
                </div>
              </div>
              {fetchedData.dataType === "campgrounds" ? (
                fetchedData.dataCount === 0 ? (
                  <RedirectBox
                    message="No Campgrounds, click below to create one"
                    redirectLink="/newcampground"
                    buttonText="Create Campground"
                  />
                ) : (
                  fetchedData.data.map((campground) => (
                    <Campgrounds
                      key={campground._id}
                      campground={campground}
                      checkBookingsToggle={() => setFutureBookings(!showFutureBookings)}
                      fetchBookingsByCampground={fetchFutureBookingsByCampground}
                    />
                  ))
                )
              ) : null}
              {fetchedData.dataType === "bookings" ? (
                fetchedData.dataCount === 0 ? (
                  <RedirectBox
                    message="No bookings, find a campground and book it!"
                    redirectLink="/campgrounds"
                    buttonText="Find campgrounds"
                  />
                ) : (
                  fetchedData.data.map((booking) => (
                    <Bookings key={booking._id} booking={booking} />
                  ))
                )
              ) : null}
              {fetchedData.dataType === "reviews" ? (
                fetchedData.dataCount === 0 ? (
                  <RedirectBox
                    message="No reviews, book campgrounds and let everyone know how they were!"
                    redirectLink="/campgrounds"
                    buttonText="Find campgrounds"
                  />
                ) : (
                  fetchedData.data.map((review) => (
                    <Reviews key={review._id} review={review} />
                  ))
                )
              ) : null}
              {fetchedData.dataCount <= cardPerPage ? null : (
                <Pagination
                  onPageChange={onPageChange}
                  currentPageCount={pageCount}
                  campgroundsCount={fetchedData.dataCount}
                  productsPerPage={cardPerPage}
                />
              )}
            </div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
