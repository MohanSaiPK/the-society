import axios from "axios";

const api = axios.create({
  baseURL: "https://the-society.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
