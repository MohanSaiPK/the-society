import React from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../assets/ceetowers.png";
import { IoPerson } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black p-4 text-white flex items-center justify-between fixed top-0 left-0 right-0 z-50 ">
      <div className="flex items-center gap-2">
        <img src={AppLogo} alt="Logo" className="h-12 w-12" />
        <div>
          <span className="text-lg text-yellow-400 font-semibold">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Dashboard
          </span>
        </div>
      </div>

      <div className="flex space-x-5">
        <div className="flex flex-col w-1/3">
          <div className="flex items-center gap-2">
            <IoPerson className="text-xl text-yellow-400" />
            <div>{user?.name}</div>
          </div>
          {user?.role === "resident" && (
            <div className="flex items-center gap-2">
              <IoHome className="text-xl text-yellow-400" />
              <div> {user.houseNumber}</div>
            </div>
          )}
          {user?.role === "service_provider" && (
            <div>Service: {user.service}</div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 w-2/3"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
