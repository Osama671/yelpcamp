import { Link } from "react-router-dom";
export default function NewCampground() {
  return (
    <>
      <h1 className="text-center">New Campground:</h1>
      <p className="text-center">
        <Link to="/">Home Page</Link>
      </p>
      <div className="col-6 offset-3">
        <form action="/api/campgrounds" method="POST">
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              className="form-control"
              id="title"
              type="text"
              name="title"
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
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">$</span>
            <input
              placeholder="0.00"
              type="text"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              id="price"
              name="price"
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
            ></textarea>
          </div>
          <button type="submit">Add Campground</button>
        </form>
      </div>
    </>
  );
}
