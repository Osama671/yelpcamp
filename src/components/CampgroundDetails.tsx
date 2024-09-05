import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CampgroundDetails() {
  const [campground, setCampground] = useState({description: "", location: ""});
  const { id } = useParams();

  useEffect(() => {
    async function getCampground() {
      const response = await axios.get(
        `http://localhost:8080/api/campgrounds/${id}`
      );
      setCampground(response.data);
    }
    getCampground();
  }, [id]);

  return (
    <>
      <h1>Campground Details:</h1>
      <h2>Location: {campground.location} </h2>
      <h2>Decription: {campground.description}</h2>
    </>
  );
}
