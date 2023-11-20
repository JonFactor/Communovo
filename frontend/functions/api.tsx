import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
