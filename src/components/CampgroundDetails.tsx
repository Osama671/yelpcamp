import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function CampgroundDetails() {
  const [campground, setCampground] = useState({
    description: "",
    location: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteCampground = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}`);
    if (response.status === 200) navigate("/campgrounds");
  };

  useEffect(() => {
    async function getCampground() {
      const response = await axios.get(`/api/campgrounds/${id}`);
      setCampground(response.data);
    }
    getCampground();
  }, [id]);
  console.log(id);
  return (
    <>
      <Navbar />
      <main>
        <h1>Campground Details:</h1>
        <h2>Location: {campground.location} </h2>
        <img src={campground.image}></img>
        <h2>Decription: {campground.description}</h2>
        <h3>
          <Link to={`/campground/${id}/edit`}>Edit Campground</Link>
        </h3>
        <button onClick={deleteCampground}>Delete</button>
      </main>
      <Footer />
    </>
  );
}
