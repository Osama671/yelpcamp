import { Link } from "react-router-dom";
export default function NewCampground() {
  return (
    <>
      <h1>New Campground:</h1>
      <p><Link to="/">Home Page</Link></p>
      <form action="/api/campgrounds" method="POST">
        <div>
          <label htmlFor="Location">Location</label>
          <input id="Location" type="text" name="location" />
        </div>
        <div>
          <label htmlFor="Description">Description</label>
          <input id="Description" type="text" name="description" />
        </div>
        <button type="submit">Add Campground</button>
      </form>
    </>
  );
}
