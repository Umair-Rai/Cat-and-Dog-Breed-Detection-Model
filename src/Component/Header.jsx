import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  const toggleMenu = () => setIsOpen(!isOpen);
  const switchLang = (e) => setLang(e.target.value);

  // ✅ Custom nav structure
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Breed Detector', path: '/breed-detection' },
    { label: 'E-Store', path: '/e-store' },
    { label: 'Breeder Connect', path: '/breeder-connect' },
    { label: 'About uASDs', path: '/about-us' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Left: Logo & Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="logo"
              className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1"
            />
            <span className="text-xl font-semibold text-gray-800">Petify</span>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="underline-grow text-gray-700 hover:text-brand transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth + Language */}
          <div className="flex items-center space-x-4">
            <select
              value={lang}
              onChange={switchLang}
              className="rounded-md border-gray-300 text-gray-700 focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="EN">EN</option>
              <option value="GER">GER</option>
            </select>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={user.avatar || '/anon.png'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                <Transition
                  show={isOpen}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => alert('Logging out')}
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
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signin"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Hamburger Icon */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="-translate-y-2 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block px-2 py-1 underline-grow text-gray-700 hover:text-brand transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100" />
            <div className="px-2 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/settings"
                    className="block px-2 py-1 text-gray-700 hover:text-purple-600"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => alert('Logging out')}
                    className="w-full text-left px-2 py-1 text-gray-700 hover:text-purple-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block px-2 py-1 text-gray-700 hover:text-purple-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/get-started"
                    className="block px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
