import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { ToastProvider } from "./components/contexts/ToastProvider.js";
import { UserProvider } from "./components/contexts/UserProvider.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserProvider>
  </StrictMode>
);
