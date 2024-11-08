export default function Campgrounds() {
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3">
          <div className="col-3">
            <img
              className="w-100 rounded"
              style={{
                objectFit: "fill",
                maxHeight: "30vh",
                minHeight: "30vh",
              }}
              src="https://picsum.photos/id/237/200/300"
            ></img>
          </div>
          <div className="col-9 ">
            <div
              className="d-flex flex-column justify-content-between overflow-x-auto"
              style={{ minHeight: "30vh" }}
            >
              <div className="d-flex flex-row justify-content-between px-4 py-2">
                <div className="col">Title</div>
                <div className="col">Location</div>
                <div className="col">Reviews</div>
                <div className="col">Average Rating</div>
                <div className="col">Upcoming Bookings</div>
              </div>
              <div className="d-flex flex-row justify-content-between px-4 py-2">
                <div className="col">gdagda</div>
                <div className="col">gdagda</div>
                <div className="col">gdagda</div>
                <div className="col">gdagda</div>
                <div className="col">gdagda</div>
              </div>
              <div className="d-flex flex-row justify-content-evenly">
                <button className="btn btn-secondary">Edit Campground</button>
                <button className="btn btn-primary">Check Bookings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
