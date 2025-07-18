import React from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../assets/bcaa.png";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={AppLogo} alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-semibold">Dashboard</span>
      </div>

      <div className="text-right">
        <div>{user?.role?.toUpperCase()}</div>
        <div>{user?.name}</div>
        {user?.role === "resident" && <div>House: {user.houseNumber}</div>}
        {user?.role === "service_provider" && (
          <div>Service: {user.service}</div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default DashboardNavbar;
