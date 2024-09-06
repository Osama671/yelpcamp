import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get("http://localhost:8080/api/campgrounds");
      setCampgrounds(info.data);
    }
    getAPI();
  }, []);
  console.log(campgrounds)

  return (
    <>
      <h1>All Campgrounds:</h1>
      <p>
        <Link to="/newcampground">Add new Campground</Link>
      </p>

      {campgrounds.map((ele, i) => (
        <li>
          <Link to={`/campground/${ele._id}`}>{ele.location}</Link>
        </li>

      ))}
    </>
  );
}
