import {Link} from "react-router-dom"
import "./App.css";

function App() {
  return (
    <>
      <div>
        <h1>Hello from the main page of the app!</h1>
        <p>Heya</p>
        <Link to="/profile">Link to Profile</Link>
        <nav>
        </nav>
      </div>
    </>
  );
}

export default App;
