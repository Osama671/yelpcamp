import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="container ">
        <div className="row d-flex justify-content-between">
          <div className="col-6">
            <h1>User Information</h1>
          </div>
          <div className="col-6 text-end">
            <h1>Change Password</h1>
          </div>
        </div>
      </div>

      <div className="container my-3 d-flex justify-content-between">
        <div className="row flex-column justify-content-evenly">
          <div className="col-6 fs-4 fw-bold">Email:</div>
          <div className="col-6 fs-4 fw-bold">Username:</div>
        </div>
        <div className="row flex-column d-flex">
          <div className="d-flex align-items-center mb-2">
            <div className="col-6">Old password:</div>
            <input type="text" className=" col-6" />
          </div>
          <div className="d-flex align-items-center mb-2">
            <div className="col-6">New Password:</div>
            <input type="text" className="col-6 " />
          </div>
          <button className="mt-2 btn btn-primary ">Confirm</button>
        </div>
      </div>
      <hr />
      <div className="container my-3 text-center">
        <div className="row justify-content-between">
          <div className="col-4 fs-3 ">My Campgrounds</div>
          <div className="col-4 fs-3">Bookings</div>
          <div className="col-4 fs-3">Reviews</div>
        </div>
      </div>
      <div>
        <h1 className="text-center m-5">INFO FROM COMPONENTS/PROFILE</h1>
      </div>
      <Footer />
    </>
  );
}
