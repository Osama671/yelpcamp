import "normalize.css"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import CampgroundCard from "./CampgroundCard.tsx";
import ClusterMap from "./Clustermap.tsx";

export default function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [dataRetrieved, setDataRetrieved] = useState(false)


  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds`);
      setCampgrounds(info.data);
      setDataRetrieved(true)
    }
    getAPI();
  }, []);

  return (
    <>
      <Navbar />
      {dataRetrieved === true && <ClusterMap campgrounds={campgrounds}></ClusterMap>}
      <main className="mt-3 vh-100">
        <h1>All Campgrounds:</h1>
        {campgrounds.length === 0 || campgrounds.map((campground) => (
          <CampgroundCard campground={campground} />
        ))}
        {campgrounds.map((ele, i) => (
          <li>
            <Link to={`/campground/${ele._id}`}>{ele.location}</Link>
          </li>
        ))}
      </main>
      <Footer />
    </>
  );
}
