import axios from "axios";

// use axios perfectly documents api varible to limit redudency
const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
