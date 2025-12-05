// src/store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userJson =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState = {
  token: token || null,
  user: userJson ? JSON.parse(userJson) : null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // <-- NEW: setUser (used after avatar upload / profile update)
    setUser(state, action) {
      state.user = action.payload;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (_) {}
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  slice.actions;
export default slice.reducer;
