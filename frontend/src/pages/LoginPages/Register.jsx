import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import regImage from "../../assets/regbg.png";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident",
    houseNumber: "",
    services: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const serviceOptions = [
    "plumbing",
    "tutor",
    "house cleaning",
    "electrician",
    "gardening",
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "services") {
      setForm((prev) => {
        if (checked) {
          return { ...prev, services: [...prev.services, value] };
        } else {
          return {
            ...prev,
            services: prev.services.filter((s) => s !== value),
          };
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload based on role
      let payload = { ...form };
      if (form.role !== "resident") delete payload.houseNumber;
      if (form.role !== "provider") delete payload.services;
      await api.post("/auth/register", payload);
      setSuccess("Registration successful! You can now log in.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="max-w-6xl w-full flex flex-col md:flex-row mx-auto mt-4 md:mt-10 p-1 md:p-4 rounded-3xl bg-black justify-center items-center shadow-2xl">
        <div className="w-full md:w-3/5 justify-center items-center flex flex-col md:m-10 m-2 bg-white rounded-3xl ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-xs md:max-w-md justify-center items-center mt-4 md:mt-10 gap-3 md:gap-5 px-1 md:px-0"
          >
            <h2 className="text-lg md:text-2xl font-sm mb-2 md:mb-4 text-yellow-400">
              Create your account
            </h2>
            {error && (
              <div className="text-xs md:text-base text-red-500 mb-1 md:mb-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs md:text-base text-green-500 mb-1 md:mb-2">
                {success}
              </div>
            )}
            <input
              name="name"
              placeholder="Name"
              className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-sm md:text-base"
              value={form.role}
              onChange={handleChange}
            >
              <option value="resident">Resident</option>
              <option value="guard">Guard</option>
              <option value="provider">Service Provider</option>
              {/* <option value="admin">Admin</option> */}
            </select>
            {/* House Number for Resident */}
            {form.role === "resident" && (
              <input
                name="houseNumber"
                placeholder="House Number"
                className="w-full mb-1 md:mb-2 p-1 md:p-2 border rounded text-black text-sm md:text-base"
                value={form.houseNumber}
                onChange={handleChange}
                required
              />
            )}
            {/* Services for Service Provider */}
            {form.role === "provider" && (
              <div className="mb-1 md:mb-2">
                <div className="font-medium mb-1 text-yellow-400 text-xs md:text-base">
                  Select Services:
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {serviceOptions.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-1 text-yellow-400 text-xs md:text-base"
                    >
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        checked={form.services.includes(service)}
                        onChange={handleChange}
                        className="text-white w-3 h-3 md:w-4 md:h-4"
                      />
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              className="w-full bg-yellow-400 text-black py-1 md:py-2 rounded text-sm md:text-base"
              type="submit"
            >
              Register
            </button>
          </form>
          <div className="mt-2 md:mt-4 text-center mb-4 md:mb-10">
            <p className="text-xs md:text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
        <div className="register-banner w-full md:w-2/5 mt-4 md:mt-0 hidden md:flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full space-y-2 md:space-y-4 px-1 md:px-0">
            <div className="w-full bg-black flex items-center justify-center h-1/5 rounded-2xl">
              <h1 className="w-full md:w-5/6 text-yellow-400 text-xs md:text-sm text-center font-bold p-1 md:p-2">
                Join Cee Towers and manage your society life with ease. Please
                fill in the details below to create your account.
              </h1>
            </div>
            <img
              src={regImage}
              alt="Register"
              className="w-1/2 md:w-2/3 rounded-3xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
