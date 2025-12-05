import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SendEmailOtp, VerifyEmail, registerUser } from "../services/auth";
import { motion } from "framer-motion";
import { BlinkBlur } from "react-loading-indicators";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  // insted of writing seperate onchange handler like
  // <input onChange={update("email")} />
  // <input onChange={ update( "username" ) } />
  // // // we are using one common function to update the state of all three input this update func takes one
  // argument: field then return another function, we used setForm to update state or data (prev) is argument
  // for previous value and then we update the data using ...prev, [field]:e.target.value
  //
  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  async function handleSendOtp(e) {
    e.preventDefault(); //ever after clicking on submit button fields did not get refresh until submit button does its job

    // function (handleSendOtp1) can be called multiple times —
    // for example
    // user clicked Send OTP once → got an error (say “Invalid email”).
    // then user fixes the email and clicks Send OTP again.
    // // Now if we don’t clear the old message, the screen might still show the old red error text while the new     process starts — which looks confusing or messy.
    setMessage(null);
    setMessageType(null);
    if (!form.email) {
      showMessage("Please enter an email", "error");
      return;
    }
    setLoading(true);
    try {
      await SendEmailOtp(form.email);
      setOtpSent(true);
      showMessage("OTP sent to your email. Check inbox (or spam).", "success");
    } catch (err) {
      showMessage(err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAndRegister(e) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    if (!otp) {
      showMessage("Enter OTP", "error");
      return;
    }
    setLoading(true);

    try {
      await VerifyEmail(form.email, otp);
      const reg = await registerUser(form);
      showMessage("Registration successful — redirecting...", "success");

      // Meaning of ?.
      // It means: “only go further if the thing before me exists (is not null or undefined)”.
      // user?.name  gives name if user exists, else undefined
      // if data before ? exits then only move futher and if it is not make whole line undefined
      if (reg?.data?.token) {
        localStorage.setItem("token", reg.data.token);
      }

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("verify/register error:", err);
      showMessage(err.message || "Signup failed", "error");
      setLoading(false);
    }
  }

  // Google login logic (unchanged)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };
  }, []);

  const handleGoogle = () => {
    setMessage(null);
    setMessageType(null);
    setGoogleLoading(true);
    try {
      window.google?.accounts?.id?.prompt();
    } catch (err) {
      console.error("Google prompt error:", err);
      setGoogleLoading(false);
      showMessage("Google sign-in failed to open. Try again.", "error");
    }
  };

  // inside Signup.jsx
  const handleGoogleResponse = async (response) => {
    const id_token = response?.credential;
    if (!id_token) {
      setGoogleLoading(false);
      showMessage("Google sign-in failed (no token returned).", "error");
      return;
    }

    try {
      // Use api (axios instance) so proxy and env works
      const res = await api.post("/users/google", { id_token });
      const data = res.data;

      if (data && data.success) {
        if (data.data?.token) localStorage.setItem("token", data.data.token);
        showMessage("Google login successful — redirecting...", "success");

        setTimeout(() => {
          setGoogleLoading(false);
          navigate("/");
        }, 900);
      } else {
        setGoogleLoading(false);
        showMessage(data?.message || "Google login failed", "error");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setGoogleLoading(false);
      showMessage(err.message || "Error connecting to server", "error");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 overflow-hidden">
      {/* subtle background image */}
      <img
        src="\animeimage2.png"
        alt="anime backdrop"
        className="absolute inset-0 w-full h-full object-cover opacity-1"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#ff8a3d,#7c3aed)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 L19 8 L14 21 L5 21 L2 8 Z"
                fill="#fff"
                opacity="0.95"
              />
            </svg>
          </div>
          <div className="text-white font-semibold">Home</div>
        </Link>
        <Link to={"/login"} className="flex items-center gap-3">
          <div className="text-white font-semibold">Login</div>
        </Link>
      </div>

      {/* glowing blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-purple-700 blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 blur-[150px] opacity-20 animate-pulse"></div>

      {/* signup card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-black/50 backdrop-blur-md border border-orange-500/40 rounded-2xl shadow-[0_0_25px_rgba(255,136,0,0.3)] p-8 w-[90%] max-w-md text-white"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-orange-400 drop-shadow">
          Create your AnimeVerse Account
        </h2>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-orange-400"
              placeholder="Username"
              value={form.username}
              onChange={update("username")}
            />
            <input
              className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-orange-400"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
            />
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-orange-400"
              placeholder="Password"
              value={form.password}
              onChange={update("password")}
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 shadow-[0_0_10px_rgba(255,136,0,0.4)]"
              >
                {loading ? (
                  <BlinkBlur color="#fff" size="small" text="Sending..." />
                ) : (
                  "Send OTP"
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogle}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
                disabled={googleLoading}
              >
                {googleLoading ? "Connecting..." : "Sign up with Google"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-3 text-center">
              Enter OTP sent to{" "}
              <span className="text-orange-400">{form.email}</span>
            </p>

            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <input
                className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 focus:outline-none focus:border-orange-400"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
                >
                  {loading ? (
                    <BlinkBlur color="#fff" size="small" text="Verifying..." />
                  ) : (
                    "Verify & Register"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setMessage(null);
                    setMessageType(null);
                  }}
                  className="flex-1 border border-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
                >
                  Back
                </button>
              </div>
            </form>
          </>
        )}

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}
      </motion.div>
    </div>
  );
}
