import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !user) {
      setUser(storedUser);
    }
  }, [user, setUser]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleProfileRedirect = () => {
     setIsProfileMenuOpen(false);
    if (!user) {
      navigate("/signin");
      return;
    }
    // Use loginType to decide where to redirect
    switch (user.loginType) {
      case "Customer Account":
        navigate("/profile/customer");
        break;
      case "Seller Account":
        navigate("/profile/seller");
        break;
      case "Admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Breed Detector", path: "/breed-detection" },
    { label: "Products", path: "/products" },
    { label: "Breeder Connect", path: "/breeder-connect" },
    { label: "About us", path: "/about-us" },
  ];

  return (
    <header className="bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="logo"
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] p-1"
            />
            <span className="text-xl font-semibold text-gray-800">Petify</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((n) => (
              <Link
                key={n.label}
                to={n.path}
                className="underline-grow text-gray-700 hover:text-purple-600 transition"
              >
                {n.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">

                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src="/anon.png"
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2 text-gray-700">{user?.name}</span>
                </button>

                <Transition
                  show={isProfileMenuOpen}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    <button
                      onClick={handleProfileRedirect}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </Transition>
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-purple-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signin"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-500"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
