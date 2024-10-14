import "normalize.css";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import CampgroundCard from "./CampgroundCard.tsx";
import ClusterMap from "./Clustermap.tsx";
import Pagination from "./Pagination.tsx";
import styles from "../styles/navbar.module.css";

export default function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [allCampgrounds, setAllCampgrounds] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const productsPerPage = 16;

  const fetchCampgrounds = async () => {
    try {
      const info = await axios.get(
        `/api/campgrounds?page=${pageCount}&productsPerPage=${productsPerPage}`
      );
      setCampgrounds(info.data);
      setDataRetrieved(true);
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

  const onPageChange = (num) => {
    setPageCount(num);
  };

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds?page=${pageCount}`);
      setCampgrounds(info.data);
      setDataRetrieved(true);
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
      {console.log(allCampgrounds)}
      <div className="vh-min-100">
        <Navbar styles={styles} />
        <main className="mt-3 ">
          {dataRetrieved ? (
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
                    {campgrounds.campgrounds.length > 0 ? (
                      campgrounds.campgrounds.map((campground) => (
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
            </>
          ) : (
            <p>Loading Campgrounds...</p>
          )}
          {campgrounds.length === 0 || (
            <Pagination
              onPageChange={onPageChange}
              currentPageCount={pageCount}
              campgroundsCount={campgrounds.count}
              productsPerPage={productsPerPage}
            />
          )}
        </main>
        <Footer styles={styles} />
      </div>
    </>
  );
}
