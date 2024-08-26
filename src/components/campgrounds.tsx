import { useEffect, useState } from "react";
import axios from "axios";

export default function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);

  useEffect(() => {
    async function getAPI() {
      console.log("Test1");
      let info = await axios.get("http://localhost:8080/api/campgrounds");
      setCampgrounds((old) => info.data);
      //   setData(await axios.get("http://localhost:8080/api/campgrounds"));
      console.log("Test2");
    }
    getAPI();
  }, []);
  return (
    <>
      {console.log("outside", campgrounds)}
      <h1>Hello!</h1>
      {campgrounds.map((ele, i) => (
        <p>{ele.description}</p>
      ))}
    </>
  );
}
