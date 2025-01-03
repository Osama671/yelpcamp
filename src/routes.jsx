import Campgrounds from "./pages/Campgrounds.tsx";
import CampgroundDetails from "./pages/CampgroundDetails.tsx";
import FourOhFour from "./pages/FourOhFour.tsx";
import NewCampground from "./pages/NewCampground.tsx";
import CampgroundEdit from "./pages/CampgroundEdit.tsx";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import HomePage from "./pages/HomePage.tsx";
import Profile from "./pages/Profile.tsx";
import { HelmetProvider } from "react-helmet-async";

const routes = [
  {
    path: "/",
    element: (
      <HelmetProvider>
        <HomePage />
      </HelmetProvider>
    ),
  },

  { path: "/newcampground", element: <AuthRoute Component={NewCampground} /> },

  {
    path: "campgrounds",
    element: <Campgrounds />,
  },
  {
    path: "campground/:id",
    element: <CampgroundDetails />,
  },
  { path: "campground/:id/edit", element: <CampgroundEdit /> },
  { path: "/profile", element: <AuthRoute Component={Profile}></AuthRoute> },

  { path: "/*", element: <FourOhFour /> },
];

export default routes;
