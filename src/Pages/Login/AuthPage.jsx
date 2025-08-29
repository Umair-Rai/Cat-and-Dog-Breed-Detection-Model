import React, { useState, useContext } from "react";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function AuthSlidePanel() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [loginType, setLoginType] = useState("Customer Account");

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    Account_type: "Customer Account",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // ---------------------------- SIGN UP ----------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signup.password !== signup.confirm) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      const endpoint =
        signup.Account_type === "Seller Account"
          ? `${API_BASE}/sellers/register`
          : `${API_BASE}/customers/register`;

      const res = await axios.post(endpoint, {
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        password: signup.password,
      });

      alert(res.data.message || "Signup successful!");
      setIsSignIn(true); // Switch to login view
      setSignup({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
        Account_type: "Customer Account",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------- LOGIN ----------------------------
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const endpoint =
      loginType === "Seller Account"
        ? `${API_BASE}/sellers/login`
        : `${API_BASE}/customers/login`;

    const res = await axios.post(endpoint, {
      email: login.email,
      password: login.password,
    });

    alert(res.data.message || "Login successful!");

    // ✅ use customer OR seller depending on API response
    const rawUser = res.data.customer || res.data.seller;
    const userWithType = { ...rawUser, loginType };

    // ✅ store clean user and token
    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(userWithType));

    setUser(userWithType);

    navigate("/"); // redirect after login
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-2">
        {/* Sign Up Form */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleSignup}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 ${
              isSignIn ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <h2 className="text-2xl font-bold">Create Account</h2>
            <InputField icon={<User />} placeholder="Full Name" value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} />
            <InputField icon={<Mail />} type="email" placeholder="Email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} />
            <InputField icon={<User />} placeholder="Phone" value={signup.phone} onChange={(e) => setSignup({ ...signup, phone: e.target.value })} />
            <InputField icon={<Lock />} type="password" placeholder="Password" value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} />
            <InputField icon={<Lock />} type="password" placeholder="Confirm Password" value={signup.confirm} onChange={(e) => setSignup({ ...signup, confirm: e.target.value })} />

            <select
              value={signup.Account_type}
              onChange={(e) => setSignup({ ...signup, Account_type: e.target.value })}
              className="w-full py-2 px-4 rounded-full border focus:ring-2 focus:ring-[#7D5FFF]"
            >
              <option>Customer Account</option>
              <option>Seller Account</option>
            </select>

            <button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Log In Form */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleLogin}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 ${
              isSignIn ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <h2 className="text-2xl font-bold">Log In</h2>
            <InputField icon={<Mail />} type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <InputField icon={<Lock />} type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />

            <select
              className="w-full py-2 px-4 rounded-full border focus:ring-2 focus:ring-[#7D5FFF]"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
            >
              <option value="Customer Account">Customer Account</option>
              <option value="Seller Account">Seller Account</option>
            </select>

            <button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Log In"}
            </button>
          </form>
        </div>

        {/* Sliding Welcome Panel */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF]
            text-white flex flex-col items-center justify-center h-[650px] rounded-3xl z-20
            transition-transform duration-700 ease-in-out
            ${isSignIn ? "translate-x-0" : "translate-x-full"}`}
        >
          <img src="/logo.png" alt="Petify" className="h-10 mb-4" />
          <h2 className="text-3xl font-bold mb-2">
            {isSignIn ? "Welcome to Petify!" : "Join Petify!"}
          </h2>
          <p className="text-sm mb-6 text-center">
            AI-powered pet intelligence tailored just for your best friend.
          </p>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-full hover:scale-105 transition"
          >
            {isSignIn ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-full border text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7D5FFF] shadow-sm"
      />
    </div>
  );
}
