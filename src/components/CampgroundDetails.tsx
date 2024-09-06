import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CampgroundDetails() {
  const [campground, setCampground] = useState({
    description: "",
    location: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteCampground = async () => {
    const response = await axios.delete(
      `http://localhost:8080/api/campgrounds/${id}`
    );
    if (response.status === 200) navigate("/campgrounds");
  };

  useEffect(() => {
    async function getCampground() {
      const response = await axios.get(
        `http://localhost:8080/api/campgrounds/${id}`
      );
      setCampground(response.data);
    }
    getCampground();
  }, [id]);
  console.log(id);
  return (
    <>
      <h1>Campground Details:</h1>
      <h2>Location: {campground.location} </h2>
      <h2>Decription: {campground.description}</h2>
      <h3>
        <Link to={`/campground/${id}/edit`}>Edit Campground</Link>
      </h3>
      <button onClick={deleteCampground}>Delete</button>
    </>
  );
}
