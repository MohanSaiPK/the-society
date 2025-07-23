import React from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../assets/ceetowers.png";
import { IoPerson } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Hamburger menu open state should be managed in Dashboard.jsx, so just show the button here and let parent handle open/close
  // We'll emit a custom event for opening the nav drawer
  const handleHamburgerClick = () => {
    const event = new CustomEvent("openResidentNav");
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black p-2 sm:p-4 text-white flex items-center justify-between fixed top-0 left-0 right-0 z-50 ">
      <div className="flex items-center gap-2">
        {/* Hamburger for resident on mobile only */}
        {user?.role === "resident" && (
          <button
            className="md:hidden mr-2 bg-yellow-400 p-1 rounded shadow-lg"
            onClick={handleHamburgerClick}
            aria-label="Open navigation menu"
          >
            <HiMenu className="w-5 h-5 text-black" />
          </button>
        )}
        <img src={AppLogo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12" />
        <div>
          <span className="text-sm sm:text-lg text-yellow-400 font-semibold">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex space-x-3 sm:space-x-5 items-center justify-end gap-3">
        <div className="flex flex-col w-1/3 justify-start items-start">
          <div className="flex items-center pr-5 sm:pr-0 gap-1 sm:gap-2">
            <IoPerson className="text-lg sm:text-xl text-yellow-400" />
            <div className="text-sm sm:text-base">{user?.name}</div>
          </div>
          {user?.role === "resident" && (
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <IoHome className="text-lg sm:text-xl text-yellow-400" />
              <div className="text-sm sm:text-base"> {user.houseNumber}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500  py-1 sm:px-3 sm:py-1 rounded hover:bg-red-600 w-1/3 text-sm sm:text-base flex items-center justify-center"
        >
          <MdLogout className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
