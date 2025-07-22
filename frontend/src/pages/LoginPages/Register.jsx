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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl   flex mx-auto mt-10 p-4  rounded-3xl bg-black justify-center items-center shadow-2xl">
        <div className="w-3/5 justify-center items-center flex flex-col m-10 bg-white rounded-3xl ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-4/5 justify-center items-center mt-10 gap-5"
          >
            <h2 className="text-2xl font-sm mb-4 text-yellow-400">
              Create your account
            </h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}
            <input
              name="name"
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded "
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full mb-2 p-2 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full mb-2 p-2 border rounded"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full mb-2 p-2 border rounded"
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
                className="w-full mb-2 p-2 border rounded text-black"
                value={form.houseNumber}
                onChange={handleChange}
                required
              />
            )}
            {/* Services for Service Provider */}
            {form.role === "provider" && (
              <div className="mb-2">
                <div className="font-medium mb-1 text-yellow-400">
                  Select Services:
                </div>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-1 text-yellow-400  "
                    >
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        checked={form.services.includes(service)}
                        onChange={handleChange}
                        className="text-white"
                      />
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button
              className="w-full bg-yellow-400 text-black py-2 rounded"
              type="submit"
            >
              Register
            </button>
          </form>
          <div className="mt-4 text-center mb-10">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
        <div className="register-banner w-2/5">
          <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
            <div className=" w-full bg-black flex items-center justify-center h-1/5">
              <h1 className=" w-5/6 text-yellow-400 text-sm text-center font-bold">
                Join Cee Towers and manage your society life with ease. Please
                fill in the details below to create your account.
              </h1>
            </div>
            <img
              src={regImage}
              alt="Register"
              className=" w-2/3 rounded-3xl "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
