import "normalize.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import CampgroundCard from "./CampgroundCard.tsx";
import ClusterMap from "./Clustermap.tsx";
import Pagination from "./Pagination.tsx";
import styles from "../styles/navbar.module.css";
import { Campground } from "../../types.ts";

interface IAllCampgrounds {
  count: number;
  campgrounds: Campground[];
}

export default function Campgrounds() {
  const [paginatedCampgrounds, setpaginatedCampgrounds] =
    useState<IAllCampgrounds | null>(null);
  const [allCampgrounds, setAllCampgrounds] = useState<IAllCampgrounds | null>(
    null
  );
  const [pageCount, setPageCount] = useState(1);

  const [, setSearchParams] = useSearchParams();

  const productsPerPage = 16;

  const fetchCampgrounds = async () => {
    try {
      const info = await axios.get(
        `/api/campgrounds?page=${pageCount}&productsPerPage=${productsPerPage}`
      );
      setpaginatedCampgrounds(info.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllCampgrounds = async () => {
    try {
      const info = await axios.get(`/api/campgrounds`);
      setAllCampgrounds(info.data);
    } catch (e) {
      console.error(e);
    }
  };

  const setPageNumInURL = () => {
    setSearchParams({ page: `${pageCount}` });
  };

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
  }, []);

  useEffect(() => {
    setPageNumInURL();
    fetchCampgrounds();
  }, [pageCount]);

  return (
    <>
      <div className="vh-min-100">
        <Navbar styles={styles} />
        <main className="mt-3 ">
          {paginatedCampgrounds && allCampgrounds ? (
            <>
              <div className="d-flex flex-column col-10 offset-1 col-md-8 offset-md-2">
                <ClusterMap
                  campgrounds={allCampgrounds.campgrounds}
                ></ClusterMap>
              </div>
              <div className="container w-50 mt-5 ">
                <form className="d-flex shadow-sm" role="search">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="CURRENTLY NOT IMPLEMENTED"
                    aria-label="Search"
                  />
                </form>
              </div>
              <div className="container-fluid d-flex flex-column">
                <h1 className="text-center mt-4">All Campgrounds:</h1>
                <div className="d-flex container mb-3 flex-row">
                  <div className="row align-items-start gap-4">
                    {paginatedCampgrounds.campgrounds.length > 0 ? (
                      paginatedCampgrounds.campgrounds.map((campground) => (
                        <CampgroundCard
                          key={campground._id}
                          campground={campground}
                        />
                      ))
                    ) : (
                      <p>No campgrounds available :(</p>
                    )}
                  </div>
                </div>
              </div>

              {Object.keys(paginatedCampgrounds).length === 0 || (
                <Pagination
                  onPageChange={onPageChange}
                  currentPageCount={pageCount}
                  campgroundsCount={paginatedCampgrounds.count}
                  productsPerPage={productsPerPage}
                />
              )}
            </>
          ) : (
            <p>Loading Campgrounds...</p>
          )}
        </main>
        <Footer styles={styles} />
      </div>
    </>
  );
}
