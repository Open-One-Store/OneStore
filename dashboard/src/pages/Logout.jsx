import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
    navigate("/login");
  });
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Logging out...</h2>
      </div>
    </div>
  );
}
