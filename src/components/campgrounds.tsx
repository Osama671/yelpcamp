import { useEffect, useState } from "react";
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
  return (
    <>
      {console.log("outside", campgrounds)}
      <h1>All Campgrounds:</h1>
      {campgrounds.map((ele, i) => (
        <li>{ele.location}</li>
      ))}
    </>
  );
}
