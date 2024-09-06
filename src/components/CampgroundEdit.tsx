import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CampgroundEdit() {
  const [campgrounds, setCampgrounds] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`http://localhost:8080/api/campgrounds/${id}/edit`);
      setCampgrounds(info.data);
    }
    getAPI();
  }, [id]);
  return (
    <>
    {console.log(id)}
      <h2>Edit Campground:</h2>
      <form action={`/api/campgrounds/${id}/edit`} method="POST">
      <div>
        <label htmlFor="location">Location: </label>
        <input type="text" id="location" name="location"/>
        <br/>
        <label htmlFor="description">Description: </label>
        <input type="text" id="description" name="description"/>
        <br/>
      <button type="submit">Edit</button>
      </div>
      </form>
    </>
  );
}
