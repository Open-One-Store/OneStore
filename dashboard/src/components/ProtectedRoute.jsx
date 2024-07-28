import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ element: Component, ...rest }) {
  const { authToken } = useContext(AuthContext);

  return authToken ? <Component {...rest} /> : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};
