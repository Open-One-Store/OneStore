import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ element: Component, ...rest }) {
  const pathname = useLocation().pathname + useLocation().search;
  console.log(pathname);
  const { authToken } = useContext(AuthContext);

  return authToken ? (
    <Component {...rest} />
  ) : (
    <Navigate to={`/login?next=${pathname}`} />
  );
}

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};
