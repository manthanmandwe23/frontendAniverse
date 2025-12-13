// src/services/auth.js
import api from "../lib/api";

// Frontend makes HTTP requests to your backend endpoints (GET/POST/etc.). Two common ways:
// fetch (browser builtin)
// axios (popular library with nicer API + interceptors)
//
// backend paths used:
// - send OTP: POST /setup/send-Email-otp  { email }
// - verify OTP: POST /setup/verify-Email-otp { email, otp }
// - register: POST /api/users/register { username, email, password, ... }
// - login: POST /api/users/login { email, password }
// - google: POST /api/users/google  (we'll open this path in a new tab/window)

// async keyword is used before a function to say:
// “This function will do something asynchronous (it will return a Promise).”
// What is await?
// await means:
// “Wait here until the Promise is done, and then give me the result.”
// You can only use await inside an async function.
//
export async function SendEmailOtp(email) {
  // return api.post("/setup/send-Email-otp", { email });
  return api.post("/getup/send-Email-otp", { email });
  // api.post() returns a Promise (because it’s an async HTTP call using Axios).
  // So, marking the function as async tells JavaScript:
  // “This function will return a Promise — it’s doing an async task.”
  // if you wanted to wait for the result inside this function, you could use await like this:
  // export async function SendEmailOtp(email) {
  // const response = await api.post("/setup/send-Email-otp", { email });
  // return response.data;
  // }
  // // But since you are just returning the Promise directly, you don’t need to use await here — whoever calls this function can await it instead:
}

export async function VerifyEmail(email, otp) {
  // return api.post("/setup/verify-Email-otp", { email, otp });
  return api.post("/getup/verify-Email-otp", { email, otp });
}

export async function registerUser(payload) {
  // payload: { username, email, password }
  return api.post("/users/register", payload);
}
``;
export async function loginUser(payload) {
  return api.post("/users/login", payload);
}

export function googleAuthUrl() {
  // If backend expects POST, it might start OAuth flow with a redirect URL.
  // If you have an OAuth start endpoint, open it. Adjust path if needed.
  return "/users/google";
}

// export async function uploadAvatar(formData) {
// Note: do NOT set Content-Type here. The api interceptor will
// remove the JSON Content-Type for FormData and let axios/browser set multipart boundary.
// return api.post("/users/me/avatar", formData);
// }
//
export async function uploadAvatar(formData) {
  return api.post("/users/me/avatar", formData);
}

// Fetch slider anime from backend (for homepage)
export async function getHomeSlider() {
  return api.get("/home/slider");
}

// add this export

// src/services/auth.js

// ...existing exports

export async function getAllAnime(params = {}) {
  // hits GET /api/anime with optional ?limit, ?sort, etc.
  return api.get("/anime", { params });
}

export function createPost(data) {
  return api.post("/posts", data);
}

// Get all posts
export function getPosts() {
  return api.get("/posts?sort=created_at&order=desc");
}

// Toggle like
export function toggleLike(id) {
  return api.post(`/posts/${id}/like`);
}
//
// What is a Promise?
// A Promise in JavaScript means:
// “I’ll give you the result later — not right now.”
// Think of it like ordering food 🍔:
// You place the order → restaurant says “Okay, wait — we’ll call you when it’s ready.”
// That’s like a Promise — the food (result) will come in the future.

// An async operation means a task that takes time to complete, and doesn’t block other code while it’s running.
// 👉 Example:
// API calls (fetching data from server)
// Reading/writing files
// Database queries
// setTimeout / setInterval (delays)
// In short:
// Async operation = any task that runs in the background and finishes later.

// async function getData() {
// const promise = new Promise((resolve) => {
// setTimeout(() => resolve("Data received"), 2000);
// });
//
// const result = await promise; // wait 2 seconds
// console.log(result); // prints "Data received"
// }
// getData();
// Here, await makes JavaScript wait for the promise to finish without blocking other code.
