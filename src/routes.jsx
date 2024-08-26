import App from "./App.tsx";
import Profile from "./components/Profile.tsx"

const routes = [
  { path: "/", element: <App /> },
  {
    path: "profile",
    element: <Profile />,
    // errorElement: <FourOhFour />,
  },
  { path: "/*", element: <App /> },
];

export default routes;
