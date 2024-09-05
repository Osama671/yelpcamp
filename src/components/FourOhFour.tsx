import { Link } from "react-router-dom";

export default function FourOhFour() {
  return (
    <>
      <h1>Sorry, the page does not exist</h1>
      <h3>
        {" "}
        <Link to="/">Click here to return to the home page</Link>{" "}
      </h3>
    </>
  );
}
