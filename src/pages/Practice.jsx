// src/lib/api.js
// It creates a custom Axios instance called api to handle all backend requests easily and safely.
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api"; // can set VITE_API_BASE in .env if needed
//const API_BASE = import.meta.env.VITE_API_BASE || "/api"; // can set VITE_API_BASE in .env if needed

// here we created axios instance where we said baseURL means all requests start from this URL (/api)
const api = axios.create({
  baseURL: API_BASE,
  // this is saying we are means frontend is sending json data
  headers: {
    "Content-Type": "application/json",
  },
  // request should fulfill in 10 sec
  timeout: 10000,
});

// Request interceptor: attach JWT if available
// interceptors is axios middleware which run before request go to backend use try catch block

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Ensure we don't override multipart form data header
      if (config.data instanceof FormData) {
        // delete json content type so browser sets proper boundary
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] =
          config.headers["Content-Type"] || "application/json";
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize error response objects
api.interceptors.response.use(
  // if we got response we return proper response
  (response) => response, // we want full response; consume .data in caller or adjust as you like
  // if not their is error sending response, then first we build a common error object
  (error) => {
    // Build a common error object
    const err = {
      message: "Network Error",
      status: null,
      data: null,
    };
    // since Axios can fail in 3 different ways 👇
    // 1️⃣ if ( error.response ) → Server sent an error
    // 2️⃣ else if (error.request) → No response from server, request is successful but server did not respond
    // 3️⃣ else → Something else happened locally
    // and this 3 different problem is handel by below three different ways
    // and beacuse of any reason below 3 error can be executed then above error response which we build get executed
    if (error.response) {
      // server responded with a status code
      err.message =
        error.response.data?.message ||
        error.response.statusText ||
        "Request failed";
      err.status = error.response.status;
      err.data = error.response.data;
    } else if (error.request) {
      // request was made but no response
      err.message = "No response from server";
    } else {
      // something else happened
      err.message = error.message;
    }
    return Promise.reject(err);
  }
);

export default api;

// What is config?
// ➡️ config = the request configuration object
// that Axios automatically creates before sending your request.
// It contains all details of the HTTP request, like:
// {
// url: "/api/users",
// method: "GET",
// headers: { "Content-Type": "application/json" },
// data: undefined,
// timeout: 10000,
// baseURL: "/api"
// }
// 🧠 Why do we use it in interceptor?
//
// Because the interceptor allows us to modify this config before the request goes out.
// Example — in your code:
// const token = localStorage.getItem("token");
// if (token) {
// config.headers.Authorization = `Bearer ${token}`;
// }
// return config;
// ✅ So you are saying:
// “Before Axios sends this request, please attach my token in the headers.”
// This is how all requests automatically include authentication.
// You call
// api.get("/profile")
// Axios builds a config object internally.
// The interceptor runs and gives you that config.
// You can modify it (add token, headers, etc.)
// Then you return config — Axios uses it to make the actual request.
