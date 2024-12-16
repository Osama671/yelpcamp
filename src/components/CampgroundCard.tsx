import { Link } from "react-router-dom";
import { Campground } from "../../types";
export default function CampgroundCard({
  campground,
  styles,
}: {
  campground: Campground;
  styles?: CSSModuleClasses;
}) {
  if (campground.images.length === 0) {
    campground.images = [
      {
        url: "https://i.pinimg.com/736x/d6/22/4b/d6224b4bfff79ecc55a028c969d4c8e3.jpg",
        filename: "",
        _id: "1",
      },
    ];
  }
  return (
    <>
      <div className="row d-flex flex-column col-12 col-sm-6 col-md-4 col-lg-3 ">
        <Link
          to={`/campground/${campground?._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="col-12 ">
            <img
              className={`w-100 h-auto rounded ${styles?.cardThumbnail}`}
              style={{
                objectFit: "fill",
                maxHeight: "30vh",
                minHeight: "30vh",
              }}
              src={campground.images[0]?.url}
              alt="Campground image"
            ></img>
          </div>
          <div className="col-md-12">
            <div className="card-body">
              <h5
                className={`card-title mt-2 text-truncate ${styles?.cardTitle}`}
              >
                {campground.title}
              </h5>
              <p
                className={`card-text my-0 text-truncate ${styles?.cardAuthor}`}
              >
                <em> By: {campground.author?.username}</em>
              </p>
              <p
                className={`card-text my-0 text-truncate ${styles?.cardLocation}`}
              >
                Location: {campground?.location}
              </p>

              <p className={`card-text my-0 ${styles?.cardPrice}`}>
                Price: ${campground?.price}/night
              </p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
