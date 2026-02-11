import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";

import { AuthProvider } from "./context/AuthContext";
import "./i18n";

const root = document.getElementById("root");

createRoot(root).render(
  <BrowserRouter>
    <AuthProvider>
      <App></App>
    </AuthProvider>
  </BrowserRouter>
);
