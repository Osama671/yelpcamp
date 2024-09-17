import { Link } from "react-router-dom";
export default function CampgroundCard({ campground }) {
  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col-md-4">
            <img className="img-fluid" src={campground.images[0].url} alt="Campground image"></img>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{campground.title}</h5>
              <p className="card-text">{campground.description}</p>
              <p className="card-text">{campground.location}</p>
              <Link className="btn btn-primary" to={`/campground/${campground._id}`}>Check out Campground!</Link>
            </div>
          </div>
        </div>
        ;
      </div>
    </>
  );
}
