import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [data, setData] = useState("");

  const fetchAPI = async () => {
    console.log("aya")
    const response = await axios.get("http://localhost:8080/api/data");
    console.log(response.data)
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <>
      <h1>This is a profile page</h1>
      <Link to="/">Link to Home page</Link>
    </>
  );
}
