import { useTheme } from "../../contexts/ThemeProvider";
import moment from "moment";

export default function PastBookings({
  pastBookingsState,
  setPastBookingsState,
  switchForms,
  campgrounds,
  fetchFutureBookingsByCampground,
  campgroundId,
}) {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.pastBooking;

  return (
    <>
      {pastBookingsState && (
        <div
          className={`min-vh-100 d-flex ${styles.fullpageWrapper}`}
          onClick={() => setPastBookingsState(!pastBookingsState)}
        >
          <div
            className={`container d-flex justify-content-center align-items-center `}
          >
            <div
              className="col-12 col-xl-10 col-xxl-8 mt-3 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`card shadow ${styles.modalCard}`}>
                <div className={`card-body ${styles.cardForm}`}>
                  <div className="d-flex justify-content-evenly ">
                    <h4
                      onClick={() => {
                        switchForms();
                        fetchFutureBookingsByCampground(campgroundId);
                      }}
                      className={`card-title ${
                        pastBookingsState ? "" : "disabled"
                      } ${styles.futureBookingsHeader}`}
                    >
                      Future Bookings
                    </h4>
                    <h4
                      onClick={switchForms}
                      className={`card-title ${
                        pastBookingsState ? "" : "disabled"
                      } ${styles.pastBookingsHeader}`}
                    >
                      Past Bookings
                    </h4>
                  </div>
                  <div className="col-12 mt-4 ">
                    <div
                      className="d-flex flex-column justify-content-between overflow-y-auto"
                      style={{ maxHeight: "50vh" }}
                    >
                      {campgrounds.length === 0 ? (
                        <h2 className={`text-center ${styles.pastBookingsMessage}`}>No previous bookings</h2>
                      ) : (
                        campgrounds.map((campground) => (
                          <>
                            <div className="d-flex flex-row justify-content-between px-4 py-2 text-center fw-bold">
                              <div className={`col ${styles.usernameHeader}`}>Username</div>
                              <div className={`col ${styles.startDateHeader}`}>Start Date</div>
                              <div className={`col ${styles.endDateHeader}`}>End Date</div>
                            </div>
                            <div className="d-flex flex-row align-items-center px-4 py-2 text-center">
                              <div
                                className={`col ${styles.usernameContent}`}
                                style={{
                                  overflow: "auto",
                                  whiteSpace: "normal",
                                  maxHeight: "25vh",
                                }}
                              >
                                {campground.author.username}
                              </div>
                              <div
                                className={`col ${styles.startDateContent}`}
                                style={{
                                  overflow: "auto",
                                  whiteSpace: "normal",
                                  maxHeight: "25vh",
                                }}
                              >
                                {moment(campground.bookings.startDate).format(
                                  "L"
                                )}
                              </div>
                              <div className={`col ${styles.endDateContent}`}>
                                {moment(campground.bookings.endDate).format(
                                  "L"
                                )}
                              </div>
                            </div>
                            <hr />
                          </>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
