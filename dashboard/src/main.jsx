import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";
import NavBar from "./components/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginForm from "./pages/login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NavBar />
      <Router>
        <Routes>
          <Route element={<App />} path="/" />
          <Route element={<LoginForm />} path="/login" />
          <Route
            element={<ProtectedRoute element={() => <h1>LOL</h1>} />}
            path="/protected"
          />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
