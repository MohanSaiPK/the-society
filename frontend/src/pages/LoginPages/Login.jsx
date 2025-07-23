import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/ceetowers.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password, role });
      login(res.data.user, res.data.token);

      // Redirect to appropriate dashboard based on role
      const { role: userRole } = res.data.user;
      let dashboardPath = "/";

      switch (userRole) {
        case "resident":
          dashboardPath = "/resident/dashboard";
          break;
        case "admin":
          dashboardPath = "/admin/dashboard";
          break;
        case "guard":
          dashboardPath = "/guard/dashboard";
          break;
        case "provider":
          dashboardPath = "/service/dashboard";
          break;
        default:
          dashboardPath = "/";
      }

      window.location.href = dashboardPath;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="mx-2 md:mx-10 max-w-xs md:max-w-lg p-3 md:p-10 border rounded-3xl justify-center items-center flex flex-col bg-black shadow-lg ">
        <div className="w-1/3 md:w-1/2 flex justify-center items-center ">
          <img src={logo} alt="logo" className="w-2/3 md:w-1/2" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full justify-center items-center gap-2 md:gap-3"
        >
          <h2 className="text-lg md:text-xl text-yellow-400 font-bold mb-2 md:mb-4">
            Welcome Back!
          </h2>
          {error && (
            <div className="text-xs md:text-base text-red-500 mb-1 md:mb-2">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            name="role"
            className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="resident">Resident</option>
            <option value="guard">Guard</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
          <button
            className="w-full bg-yellow-400 text-white py-1 md:py-2 rounded text-sm md:text-base"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-2 md:mt-4 text-center">
          <p className="text-xs md:text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
