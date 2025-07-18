import PublicNavbar from "../components/NavBar/PublicNavbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <PublicNavbar />
      <div className=" h-screen">
        <Outlet />
      </div>
    </>
  );
}
