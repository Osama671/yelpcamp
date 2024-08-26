import App from "./App.tsx";
import Campgrounds from "./components/campgrounds.tsx"
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
  { path: "/*", element: <App /> },
];

export default routes;
