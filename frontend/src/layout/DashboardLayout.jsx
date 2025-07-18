import DashboardNavbar from "../components/NavBar/DashboardNavbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <DashboardNavbar />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
