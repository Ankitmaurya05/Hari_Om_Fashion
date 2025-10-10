import axios from "axios";

axios.defaults.baseURL = "https://hari-om-fashion.onrender.com";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});