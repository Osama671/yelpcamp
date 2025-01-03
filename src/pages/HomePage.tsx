import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../components/contexts/ThemeProvider";

export default function HomePage() {
  const { styles: campgroundStyle } = useTheme();
  const styles = campgroundStyle.homepage;
  return (
    <>
      <Helmet>
        <meta charSet="UTF-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta name="description" content="Beautiful YelpCamp 10/10" />
        <title>Yelpcamp</title>
      </Helmet>
      <div
        className={`${styles.homepageWrapper} d-flex text-center bg-dark justify-content-center`}
      >
        <Navbar stylesProp={styles} />

        <div
          className={`${styles.coverContainer} d-flex w-100 h-100 p-3 mx-auto flex-column text-white`}
        >
          <header className="mb-auto"></header>
          <main className="px-3">
            <h1>YelpCamp</h1>
            <p className="lead">
              Welcome to YelpCamp! <br /> Jump right in and explore our many
              campgrounds. <br />
              Feel free to share some of your own and comment on others!
            </p>
            <Link
              to="/campgrounds"
              className={`${styles.btnSecondaryBS} btn btn-lg btn-secondary font-weight-bold border-white bg-white`}
            >
              <strong>View Campgrounds</strong>
            </Link>
          </main>
          <Footer stylesProp={styles} />
        </div>
      </div>
    </>
  );
}
