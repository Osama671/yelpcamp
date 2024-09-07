import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function CampgroundDetails() {
  const [campground, setCampground] = useState({});
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
  return (
    <>
      <Navbar />
      <main>
        <div className="row">
          <div className="col-6 offset-3">
            <div className="card">
              <img src={campground.image} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{campground.title}</h5>
                <p className="card-text">{campground.description}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">{campground.location}</li>
                <li className="list-group-item">${campground.price}/night</li>
                <li className="list-group-item">A third item</li>
              </ul>
              <div className="card-body">
                <Link
                  to={`/campground/${id}/edit`}
                  className="btn btn-info card-link"
                >
                  Edit Campground
                </Link>
                <button
                  onClick={deleteCampground}
                  className="btn btn-danger card-link"
                >
                  Delete Campground
                </button>
              </div>
              <div className="card-footer text-body-secondary">
                <Link to="/campgrounds">All Campgrounds </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
