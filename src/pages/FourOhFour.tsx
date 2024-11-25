import { Link } from "react-router-dom";
import { useTheme } from "../components/contexts/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FourOhFour() {
  const { styles: FourOhFourStyles } = useTheme();
  const styles = FourOhFourStyles.fourOhFour;
  return (
    <>
      <div className={`${styles.FourOhFourWrapper} `}>
        <Navbar stylesProp={styles} />
        <div className="d-flex flex-column justify-content-center align-content-center m-auto">
          <h1 className={`align-self-center mb-3 text-center ${styles.text}`}>
            Sorry, the page does not exist
          </h1>
          <div className="d-flex justify-content-evenly">
            <Link to="/">
              <button className={`m-auto btn ${styles.homepageButton}`}>
                Homepage
              </button>
            </Link>
            <Link to="/campgrounds">
              <button className={`m-auto btn ${styles.campgroundsButton}`}>
                Campgrounds
              </button>
            </Link>
          </div>
        </div>
        <Footer stylesProp={styles} />
      </div>
    </>
  );
}
