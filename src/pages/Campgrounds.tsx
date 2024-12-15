import "normalize.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import CampgroundCard from "../components/CampgroundCard.tsx";
import ClusterMap from "../components/Clustermap.tsx";
import Pagination from "../components/Pagination.tsx";
import Loader from "../components/Loader.tsx";
import { Campground } from "../../types.ts";
import { useTheme } from "../components/contexts/ThemeProvider.tsx";
import { useToast } from "../components/contexts/ToastProvider.tsx";

interface IAllCampgrounds {
  count: number;
  campgrounds: Campground[];
}

export default function Campgrounds() {
  const { styles: campgroundStyles, mapboxStyle } = useTheme();
  const styles = campgroundStyles.campgrounds;

  const showToast = useToast();

  const [paginatedCampgrounds, setPaginatedCampgrounds] =
    useState<IAllCampgrounds | null>(null);
  const [allCampgrounds, setAllCampgrounds] = useState<IAllCampgrounds | null>(
    null
  );
  const [pageCount, setPageCount] = useState(1);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dropdownSearchResults, setDropdownSearchResults] = useState<
    Campground[] | []
  >([]);

  const productsPerPage = 16;

  const [, setSearchParams] = useSearchParams();

  const searchRef = useRef<string>("");

  const removeSearchDropdown = () => {
    setShowSearchResults(false);
  };

  const handleBodyClick = () => {
    removeSearchDropdown();
    document.body.removeEventListener("click", handleBodyClick);
  };

  const navigate = useNavigate();

  const debounce = (fetchResults: () => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => fetchResults(), delay);
    };
  };

  const debouncedLog = debounce(
    () => fetchSearchDropdownResults(searchRef.current),
    400
  );

  const onSearchKeyStroke = (e: React.ChangeEvent<HTMLFormElement>) => {
    searchRef.current = e.target.value;
    if (searchRef.current.length > 2) {
      setShowSearchResults(true);
      debouncedLog();
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageCount(1);
    fetchCampgrounds();
    setShowSearchResults(false);
  };

  const fetchCampgrounds = useCallback(async () => {
    try {
      const searchQuery = searchRef.current;
      const info = await axios.get(
        `/api/campgrounds?page=${pageCount}&productsPerPage=${productsPerPage}`,
        { params: { searchQuery } }
      );
      setPaginatedCampgrounds(info.data);
      return true;
    } catch (e) {
      console.error(e);
      return false;
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

  const fetchSearchDropdownResults = async (searchQuery: string) => {
    try {
      const response = await axios.get("/api/campgrounds/dropdown", {
        params: { searchQuery },
      });
      setDropdownSearchResults(response.data);
      console.log("Heya:", response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds?page=${pageCount}`);
      setPaginatedCampgrounds(info.data);
      fetchAllCampgrounds();
    }
    getAPI();
  }, [pageCount]);

  useEffect(() => {
    setPageNumInURL();
    async function fetchCampgroundsAPI() {
      const pageTimer = new Promise((resolve) => {
        setTimeout(() => resolve(""), 5000);
      });
      const promiseResult = await Promise.all([fetchCampgrounds(), pageTimer]);
      if (promiseResult[0] === false) {
        if (showToast) {
          showToast("Server error, please try again later.", "red");
          navigate("/");
        }
      }
    }
    fetchCampgroundsAPI();
  }, [pageCount, setPageNumInURL, fetchCampgrounds, navigate, showToast]);
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
                  <form
                    className="shadow-sm"
                    role="search"
                    onSubmit={handleSearch}
                    onChange={onSearchKeyStroke}
                    onClick={() =>
                      searchRef.current.length > 2 && setShowSearchResults(true)
                    }
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex">
                      <input
                        className={`${styles.searchBar} form-control rounded text-white`}
                        type="search"
                        placeholder="Search..."
                        aria-label="Search"
                        name="search"
                      />
                    </div>
                    {showSearchResults && (
                      <>
                        {document.body.addEventListener(
                          "click",
                          handleBodyClick
                        )}
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            backgroundColor: "white",
                            textAlign: "left",
                            overflowY: "auto",
                            maxHeight: "30vh",
                            zIndex: "9999",
                          }}
                        >
                          {dropdownSearchResults.length <= 0 ? (
                            <h4 style={{ textAlign: "center" }}>
                              No Campgrounds found :(
                            </h4>
                          ) : (
                            <>
                              {dropdownSearchResults.map(
                                (result: Campground) => (
                                  <>
                                    <Link to={`/campground/${result._id}`}>
                                      <div
                                        style={{
                                          paddingLeft: "20px",
                                          padding: "1em",
                                        }}
                                      >
                                        {result.title}
                                      </div>
                                    </Link>
                                    <hr style={{ margin: "0px" }} />
                                  </>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
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
                      <h3>No Campgrounds found :(</h3>
                    )}
                  </div>
                </div>

                {Object.keys(paginatedCampgrounds).length === 0 || (
                  <div className="mt-3">
                    <Pagination
                      onPageChange={onPageChange}
                      currentPageCount={pageCount}
                      campgroundsCount={paginatedCampgrounds.count}
                      productsPerPage={productsPerPage}
                      styles={styles}
                    />
                  </div>
                )}
              </>
            ) : (
              <Loader loadingMessage={"Loading Campgrounds..."} />
            )}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
