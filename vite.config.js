// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // proxy all /api requests to your backend (Go server on :8080)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // you can add rewrite if your backend doesn't have /api prefix
        // rewrite: (path) => path.replace(/^\/api/, '')
      },

      // "/uploads": {
        // target: "http://localhost:8080",
        // changeOrigin: true,
        // secure: false,
      // },
    },
  },
});

// defineConfig is a helper function provided by Vite.
// 👉 It’s used to define or describe all settings( like plugins, server, proxy, etc.) in one place.
// also:
// defineConfig() gives you auto-suggestions (IntelliSense) in VS Code and helps avoid small errors.
// So it’s just a cleaner, safer way to write configuration.
//
// A plugin is like an “add-on” or “extra feature” that extends Vite’s power.
// Think of it like:
// You install Chrome.
// Then you add extensions for ad-block, dark mode, etc.
//
// Similarly:
// Vite by itself knows how to build normal JS files.
// But React syntax (like <App /> and JSX) isn’t normal JS.
// So we add a React plugin to teach Vite how to handle React files.
//
// import react from "@vitejs/plugin-react";
// This imports Vite’s official React plugin.
// then:
// plugins: [react()]
// means → “Hey Vite, please use React plugin so I can write React components (JSX, hooks, etc.)”.
// Without this line, Vite wouldn’t understand React syntax and would give errors like:
// Unexpected token <
// So this line is necessary for React projects. ✅
//
//
// changeOrigin: true and secure: false
//
// These two are proxy options (used only when connecting frontend to backend).
// Let’s break them:
//
// 🔸 changeOrigin: true
// When your frontend (on port 5173) makes a request to backend (port 8080),
// the browser includes the “origin” header — which shows where the request came from.
//
// By default:
// Origin: http://localhost:5173
//
// Sometimes backend blocks this because it expects:
// Origin: http://localhost:8080
//
//
// So, changeOrigin: true makes the proxy pretend that the request came from the backend itself.
// ✅ It helps avoid CORS or “blocked by origin” problems.
//
// secure: false
// This just means → “allow proxying to HTTP servers (not only HTTPS).”
// Your Go backend is running on http://localhost:8080 (not secure HTTPS),
// so we set secure: false to allow that.
//
//
// Why we wrote /api like this:
// proxy: {
// "/api": { ... }
// }
//
//
// This means:
// ➡️ “Whenever any request starts with /api, send it to the backend.”
//
// Example:
// fetch("/api/login")
// will automatically go to:
// http://localhost:8080/api/login
// If you didn’t add /api, you’d have to write:
// fetch("http://localhost:8080/login")
// every time — which is messy.
//
// So / api is just a shortcut / prefix.
//
//
// What does this line do?
// rewrite: (path) => path.replace(/^\/api/, '')
//
// This is an optional line for special cases.
// Let’s understand simply 👇
// Suppose your frontend calls:
// /api/users
// But your backend routes are:
// /users
// (not /api/users)
// Then the backend won’t find /api/users, it only knows /users.
// So we tell proxy:
// “Whenever you see /api/users, remove /api before sending to backend.”
// That’s what rewrite does.

// proxy: {
// "/api": {
// target: "http://localhost:8080",
// changeOrigin: true,
// secure: false,
// },
// },
// This is for connecting frontend (React) with your backend (Go).
// When you make a frontend request like:
// js
// Copy code
// fetch("/api/users");
// 👉 Instead of sending that to http://localhost:5173/api/users,
// Vite will automatically proxy (forward) it to:
// bash
// Copy code
// http://localhost:8080/api/users
// (where your Go backend is running)
// 💡 Why do we need proxy?
// Because if your frontend runs on port 5173 and backend on port 8080,
// the browser usually blocks requests between different ports (CORS issue).
// So the proxy acts like a bridge to bypass CORS during development. 🚀
