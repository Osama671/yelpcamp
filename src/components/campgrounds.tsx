import "normalize.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import CampgroundCard from "./CampgroundCard.tsx";
import ClusterMap from "./Clustermap.tsx";
import styles from "../styles/navbar.module.css";

export default function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [dataRetrieved, setDataRetrieved] = useState(false);

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds`);
      setCampgrounds(info.data);
      setDataRetrieved(true);
    }
    getAPI();
  }, []);

  return (
    <>
      <div className="vh-100">
        <Navbar styles={styles} />
        <div className="d-flex flex-column col-10 offset-1 col-md-8 offset-md-2">
          <main className="mt-3 ">
            {dataRetrieved ? (
              <>
                <ClusterMap campgrounds={campgrounds}></ClusterMap>
                <h1>All Campgrounds:</h1>
                {campgrounds.length > 0 ? (
                  campgrounds.map((campground) => (
                    <CampgroundCard
                      key={campground._id}
                      campground={campground}
                    />
                  ))
                ) : (
                  <p>No campgrounds available :(</p>
                )}
              </>
            ) : (
              <p>Loading Campgrounds...</p>
            )}
          </main>
        </div>
        <Footer styles={styles} />
      </div>
    </>
  );
}
{
  /* Pagination Code to be implemented in React soon™}
{/* <ul className="pagination justify-content-center">
  <li className="page-item">
    <a className="page-link" href="#" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  <li className="page-item">
    <a className="page-link" href="#">
      1
    </a>
  </li>
  <li className="page-item">
    <a className="page-link" href="#">
      2
    </a>
  </li>
  <li className="page-item">
    <a className="page-link" href="#">
      3
    </a>
  </li>
  <li className="page-item">
    <a className="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
</ul>; */
}
