import App from "./App.tsx";
import Campgrounds from "./components/Campgrounds.tsx"
import CampgroundDetails from "./components/CampgroundDetails.tsx"
import FourOhFour from "./components/FourOhFour.tsx"
import Profile from "./components/Profile.tsx"

const routes = [
  { path: "/", element: <App /> },
  {
    path: "profile",
    element: <Profile />,
    // errorElement: <FourOhFour />,
  },
  {
    path: "campgrounds",
    element: <Campgrounds />
  },
  {
    path: "campground/:id",
    element: <CampgroundDetails />
  },
  { path: "/*", element: <FourOhFour /> },
];

export default routes;