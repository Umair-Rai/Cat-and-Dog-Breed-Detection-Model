import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import axios from 'axios';

export default function AuthSlidePanel() {
  const [isSignIn, setIsSignIn] = useState(true); // true = login form, false = signup form

  const [signup, setSignup] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    Account_type: 'Customer',
    image: null,
  });

  const [login, setLogin] = useState({ email: '', password: '' });

  // SIGN UP request
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signup.password !== signup.confirm) return alert('Passwords do not match');

    try {
      const res = await axios.post("http://localhost:5000/api/customers/signup", {
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        password: signup.password,
        account_type:
          signup.Account_type.toLowerCase().includes("customer") ? "customer" : "",
      });
      alert(res.data.message);
      setIsSignIn(true); // switch to login
      // reset form:
      setSignup({
        name: '', email: '', phone: '', password: '', confirm: '', Account_type: 'Customer', image: null
      });
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  // LOGIN request
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers/login", {
        email: login.email,
        password: login.password
      });
      alert(res.data.message);
      localStorage.setItem("token", res.data.accessToken);
      // TODO: redirect after login
      console.log(res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-2">
        
        {/* Sign Up Form */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleSignup}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 
            ${isSignIn ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <h2 className="text-2xl font-bold">Create Account</h2>
            <Input icon={<User />} placeholder="Full Name" value={signup.name} onChange={e => setSignup({ ...signup, name: e.target.value })} />
            <Input icon={<Mail />} type="email" placeholder="Email" value={signup.email} onChange={e => setSignup({ ...signup, email: e.target.value })} />
            <Input icon={<Lock />} type="password" placeholder="Password" value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} />
            <Input icon={<Lock />} type="password" placeholder="Confirm Password" value={signup.confirm} onChange={e => setSignup({ ...signup, confirm: e.target.value })} />

            <select
              value={signup.Account_type}
              onChange={e => setSignup({ ...signup, Account_type: e.target.value })}
              className="w-full py-2 px-4 rounded-full border focus:ring-2 focus:ring-[#7D5FFF]"
            >
              <option>Customer Account</option>
              <option>Seller Account</option>
            </select>

            <button className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition">
              Sign Up
            </button>
          </form>
        </div>

        {/* Log In Form */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleLogin}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 
            ${isSignIn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <h2 className="text-2xl font-bold">Log In</h2>
            <Input icon={<Mail />} type="email" placeholder="Email" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
            <Input icon={<Lock />} type="password" placeholder="Password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
            <button className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition">
              Log In
            </button>
          </form>
        </div>

        {/* Sliding Welcome Panel */}
        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF]
            text-white p-10 flex flex-col items-center justify-center rounded-3xl z-20
            transition-transform duration-700 ease-in-out
            ${isSignIn ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <img src="/logo.png" alt="Petify" className="h-10 mb-4" />
          <h2 className="text-3xl font-bold mb-2">{isSignIn ? 'Welcome to Petify!' : 'Join Petify!'}</h2>
          <p className="text-sm mb-6 text-center">
            AI-powered pet intelligence tailored just for your best friend.
          </p>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-full hover:scale-105 transition"
          >
            {isSignIn ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, ...props }) {
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
