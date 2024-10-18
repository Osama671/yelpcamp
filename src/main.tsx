import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { ToastProvider } from "./components/contexts/ToastProvider.js";
import { UserProvider } from "./components/contexts/UserProvider.js";
import { ThemeProvider } from "./components/contexts/ThemeProvider.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>
);
