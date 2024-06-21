import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://localhost:5173/api",
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    // "Content-Type": "multipart/form-data",
  },
});

export const instanceForMultipart = axios.create({
  baseURL: "http://localhost:5173/api",
  // baseURL: "http://localhost:3000",
  headers: {
    // "Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  },
});
