import "normalize.css";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import CampgroundCard from "./CampgroundCard.tsx";
import ClusterMap from "./Clustermap.tsx";
import Pagination from "./Pagination.tsx";
import navbarStyles from "../styles/navbar.module.css";
import { Campground } from "../../types.ts";
import { useTheme } from "./contexts/ThemeProvider.tsx";

interface IAllCampgrounds {
  count: number;
  campgrounds: Campground[];
}

export default function Campgrounds() {
  const { styles: campgroundStyles, mapboxStyle } = useTheme();
  const styles = campgroundStyles.campgrounds;
  const [paginatedCampgrounds, setpaginatedCampgrounds] =
    useState<IAllCampgrounds | null>(null);
  const [allCampgrounds, setAllCampgrounds] = useState<IAllCampgrounds | null>(
    null
  );
  const [pageCount, setPageCount] = useState(1);

  const [, setSearchParams] = useSearchParams();

  const productsPerPage = 16;

  const fetchCampgrounds = useCallback(async () => {
    try {
      const info = await axios.get(
        `/api/campgrounds?page=${pageCount}&productsPerPage=${productsPerPage}`
      );
      setpaginatedCampgrounds(info.data);
    } catch (e) {
      console.error(e);
    }
  }, [pageCount]);

  const fetchAllCampgrounds = async () => {
    try {
      const info = await axios.get(`/api/campgrounds`);
      setAllCampgrounds(info.data);
    } catch (e) {
      console.error(e);
    }
  };

  const setPageNumInURL = useCallback(() => {
    setSearchParams({ page: `${pageCount}` });
  }, [pageCount, setSearchParams]);

  const onPageChange = (num: number) => {
    setPageCount(num);
  };

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds?page=${pageCount}`);
      setpaginatedCampgrounds(info.data);
      fetchAllCampgrounds();
    }
    getAPI();
  }, [pageCount]);

  useEffect(() => {
    setPageNumInURL();
    fetchCampgrounds();
  }, [pageCount, setPageNumInURL, fetchCampgrounds]);
  return (
    <>
      <div className={`campgroundsWrapper ${styles?.campgroundsWrapper}`}>
        <div className="vh-min-100">
          <Navbar />
          <main className={`mt-3`}>
            {paginatedCampgrounds && allCampgrounds ? (
              <>
                <div className="d-flex flex-column col-10 offset-1 col-md-8 offset-md-2">
                  <ClusterMap
                    campgrounds={allCampgrounds.campgrounds}
                    mapboxStyle={mapboxStyle}
                  ></ClusterMap>
                </div>
                <div className={`container col-12 col-md-6 mt-5 text-center `}>
                  <form className="shadow-sm" role="search">
                    <div className="d-flex">
                      <input
                        className={`${styles.searchBar} form-control rounded text-white`}
                        type="search"
                        placeholder="Search...            (not implemented yet :'<)"
                        aria-label="Search"
                      />
                    </div>
                  </form>
                </div>
                <div
                  className={`container d-flex flex-column mt-5 ${styles.main}`}
                >
                  <h1 className={`text-center mt-4 ${styles.campgroundsTitle}`}>
                    All Campgrounds:
                  </h1>
                  <div className="container d-flex mb-3 flex-wrap align-items-start justify-content-center gap-4">
                    {paginatedCampgrounds.campgrounds.length > 0 ? (
                      paginatedCampgrounds.campgrounds.map((campground) => (
                        <CampgroundCard
                          key={campground._id}
                          campground={campground}
                          styles={styles}
                        />
                      ))
                    ) : (
                      <p>No campgrounds available :(</p>
                    )}
                  </div>
                </div>

                {Object.keys(paginatedCampgrounds).length === 0 || (
                  <Pagination
                    onPageChange={onPageChange}
                    currentPageCount={pageCount}
                    campgroundsCount={paginatedCampgrounds.count}
                    productsPerPage={productsPerPage}
                    styles={styles}
                  />
                )}
              </>
            ) : (
              <p>Loading Campgrounds...</p>
            )}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
