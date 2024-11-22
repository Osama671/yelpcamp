import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AuthRoute({ Component }: {Component: React.ComponentType}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAuthentication() {
      const response = await axios.get("/api/auth/check");
      setIsAuthenticated(() => response.data.authenticated);
      setIsLoading(false);
    }
    getAuthentication();
  }, []);

  if (isLoading) {
    return null;
  } else {
    return isAuthenticated ? <Component /> : <Navigate to="/campgrounds" replace />;
  }
}
