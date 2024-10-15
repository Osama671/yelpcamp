import { Link } from "react-router-dom";
import { Campground } from "../../types";
export default function CampgroundCard({
  campground,
}: {
  campground: Campground;
}) {
  return (
    <>
      <div className="row d-flex flex-column col-12 col-sm-6 col-md-4 col-lg-3 ">
        <Link
          to={`/campground/${campground._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="col-md-12">
            <img
              className="img-fluid mx-auto d-block w-100 rounded"
              src={campground.images[0].url}
              alt="Campground image"
            ></img>
          </div>
          <div className="col-md-12">
            <div className="card-body">
              <h5 className="card-title mt-2">{campground.title}</h5>
              <p className="card-text my-0 text-secondary">
                <em> By: {campground.author.username}</em>
              </p>
              <p className="card-text my-0 ">Location: {campground.location}</p>

              <p className="card-text my-0 ">
                Price: ${campground.price}/night
              </p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
