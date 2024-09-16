import App from "./App.tsx";
import Campgrounds from "./components/Campgrounds.tsx";
import CampgroundDetails from "./components/CampgroundDetails.tsx";
import FourOhFour from "./components/FourOhFour.tsx";
import NewCampground from "./components/NewCampground.tsx";
import CampgroundEdit from "./components/CampgroundEdit.tsx";
import Profile from "./components/Profile.tsx";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import AuthRoute from "./components/auth/AuthRoute.tsx";

const routes = [
  { path: "/", element: <App /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
  { path: "/newcampground", element: <AuthRoute Component={NewCampground} /> },
  {
    path: "profile",
    element: <Profile />,
    // errorElement: <FourOhFour />,
  },
  {
    path: "campgrounds",
    element: <Campgrounds />,
  },
  {
    path: "campground/:id",
    element: <CampgroundDetails />,
  },
  { path: "campground/:id/edit", element: <CampgroundEdit /> },

  { path: "/*", element: <FourOhFour /> },
];

export default routes;
