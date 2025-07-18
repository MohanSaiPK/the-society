import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashBoardLayout";
import PrivateRoute from "./PrivateRoute";

import LandingPage from "../Pages/LandingPage";
import ResidentDashboard from "../pages/resident/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import GuardDashboard from "../pages/guard/Dashboard";
import ServiceDashboard from "../pages/serviceProvider/Dashboard";
import Login from "../pages/LoginPages/Login";
import Register from "../pages/LoginPages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <PrivateRoute
            allowedRoles={["resident", "admin", "guard", "service_provider"]}
          >
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/resident/dashboard" element={<ResidentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/guard/dashboard" element={<GuardDashboard />} />
        <Route path="/service/dashboard" element={<ServiceDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
