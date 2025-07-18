import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Map database roles to route roles
  const roleMapping = {
    resident: "resident",
    admin: "admin",
    guard: "guard",
    provider: "service_provider",
  };

  const userRole = roleMapping[user.role] || user.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
