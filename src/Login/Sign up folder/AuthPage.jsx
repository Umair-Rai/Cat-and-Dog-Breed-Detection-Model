import React, { useState } from 'react';
import { Mail, Lock, User, Upload } from 'lucide-react';

export default function AuthSlidePanel() {
  const [isSignIn, setIsSignIn] = useState(true);

  const [signup, setSignup] = useState({
    name: '', email: '', password: '', confirm: '', petType: 'Dog', image: null,
  });

  const [login, setLogin] = useState({ email: '', password: '' });

  const handleSignup = e => {
    e.preventDefault();
    if (signup.password !== signup.confirm) return alert('Passwords do not match');
    console.log('Sign Up:', signup);
  };

  const handleLogin = e => {
    e.preventDefault();
    console.log('Log In:', login);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-2">

        {/* Sign Up Form (left) */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleSignup}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 ${
              isSignIn ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <h2 className="text-2xl font-bold">Create Account</h2>
            <Input icon={<User />} name="name" placeholder="Full Name" value={signup.name} onChange={e => setSignup({ ...signup, name: e.target.value })} />
            <Input icon={<Mail />} name="email" type="email" placeholder="EmailSDSD" value={signup.email} onChange={e => setSignup({ ...signup, email: e.target.value })} />
            <Input icon={<Lock />} name="password" type="password" placeholder="Password" value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} />
            <Input icon={<Lock />} name="confirm" type="password" placeholder="Confirm Password" value={signup.confirm} onChange={e => setSignup({ ...signup, confirm: e.target.value })} />
            <select
              name="petType"
              value={signup.petType}
              onChange={e => setSignup({ ...signup, petType: e.target.value })}
              className="w-full py-2 px-4 rounded-full border focus:ring-2 focus:ring-[#7D5FFF]"
            >
              <option>Dog</option>
              <option>Cat</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <Upload className="text-gray-400" />
              <span>Upload Pet Image</span>
              <input type="file" name="image" className="hidden" onChange={e => setSignup({ ...signup, image: e.target.files[0] })} />
            </label>
            <button className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition">
              Sign Up
            </button>
          </form>
        </div>

        {/* Log In Form (right) */}
        <div className="flex items-center justify-center bg-white z-10">
          <form
            onSubmit={handleLogin}
            className={`w-full max-w-sm space-y-5 px-8 transition-opacity duration-500 ${
              isSignIn ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <h2 className="text-2xl font-bold">Log In</h2>
            <Input icon={<Mail />} name="email" type="email" placeholder="Email" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
            <Input icon={<Lock />} name="password" type="password" placeholder="Password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
            <button className="w-full py-3 bg-gradient-to-r from-[#7D5FFF] to-[#5E9BFF] text-white rounded-full shadow hover:scale-105 transition">
              Log In
            </button>
          </form>
        </div>

        {/* Sliding Welcome Panel */}
        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF]
            text-white p-10 flex flex-col items-center justify-center rounded-3xl
            transition-transform duration-700 ease-in-out z-20
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
