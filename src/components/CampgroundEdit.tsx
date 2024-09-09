import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function CampgroundEdit() {
  const [campground, setCampground] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function getAPI() {
      const info = await axios.get(`/api/campgrounds/${id}/edit`);
      setCampground(info.data);
    }
    getAPI();
  }, [id]);
  return (
    <>
      <h1 className="text-center">Edit Campground:</h1>
      <p className="text-center"></p>
      <div className="col-6 offset-3">
        <form action={`/api/campgrounds/${id}/edit`} method="POST">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              className="form-control"
              id="title"
              type="text"
              name="title"
              placeholder={campground.title}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              className="form-control"
              id="location"
              type="text"
              name="location"
              placeholder={campground.location}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">$</span>
            <input
              type="text"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              id="price"
              name="price"
              placeholder={campground.price}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="imageurl">
              Image Url
            </label>
            <input
              className="form-control"
              id="imageurl"
              type="text"
              name="imageurl"
              placeholder={campground.image}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder={campground.description}
            ></textarea>
          </div>
          <button className="btn btn-info" type="submit">
            Update Campground
          </button>
        </form>
        <div className="mt-3">
          <Link to="/campgrounds">Back to Campgrounds</Link>
        </div>
      </div>

      {/* <h2>Edit Campground:</h2>
      <form action={`/api/campgrounds/${id}/edit`} method="POST">
      <div>
        <label htmlFor="location">Location: </label>
        <input type="text" id="location" name="location"/>
        <br/>
        <label htmlFor="description">Description: </label>
        <input type="text" id="description" name="description"/>
        <br/>
      <button type="submit">Update Campground</button>
      </div>
      </form> */}
    </>
  );
}
