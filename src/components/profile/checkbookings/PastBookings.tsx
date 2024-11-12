import axios from "axios";
import { useTheme } from "../../contexts/ThemeProvider";

export default function PastBookings({
  pastBookingsState,
  setPastBookingsState,
  switchForms,
}) {
  const { styles: campgroundStyles } = useTheme();
  const styles = campgroundStyles.register;

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
                      onClick={switchForms}
                      className={`card-title ${
                        pastBookingsState ? "" : "disabled"
                      } ${styles.loginHeader}`}
                    >
                      Future Bookings
                    </h4>
                    <h4
                      onClick={switchForms}
                      className={`card-title ${
                        pastBookingsState ? "" : "disabled"
                      } ${styles.registerHeader}`}
                    >
                      Past Bookings
                    </h4>
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
