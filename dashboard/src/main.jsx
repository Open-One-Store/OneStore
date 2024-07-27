import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import NavBar from "./components/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginForm from "./pages/login.jsx";
import Logout from "./pages/Logout.jsx";
import RegisterForm from "./pages/Register.jsx";
import DashboardLayout from "./components/Dashboardlayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <NavBar />
        <Router>
          <Routes>
            <Route element={<App />} path="/" />
            <Route element={<LoginForm />} path="/login" />
            <Route element={<Logout />} path="/logout" />
            <Route element={<RegisterForm />} path="/register" />
            <Route
              element={<ProtectedRoute element={DashboardLayout} />}
              path="/dashboard/*"
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
