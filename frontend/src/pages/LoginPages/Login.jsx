import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

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
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          name="role"
          className="w-full mb-2 p-2 border rounded"
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
          className="w-full bg-blue-500 text-white py-2 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
