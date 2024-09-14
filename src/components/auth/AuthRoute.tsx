import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AuthRoute({ Component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAuthentication() {
      const response = await axios.get("/api/auth/check");
      console.log(response.data.authenticated)
      setIsAuthenticated(() => response.data.authenticated);
      setIsLoading(false);
    }
    getAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
  }
}
