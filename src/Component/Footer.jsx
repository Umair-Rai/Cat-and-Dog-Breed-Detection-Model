import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react'; // You can replace with Heroicons if needed

const Footer = () => {
  const features = ['Home', 'Breed Detection', 'Smart Shopping', 'Breeder Connect'];
  const company = ['About', 'Contact', 'Privacy Policy', 'Terms'];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout for content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Left: Branding */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logo.png"
                alt="logo"
                className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1"
              />
              <span className="text-2xl font-semibold text-white">Petify</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered pet intelligence for the modern pet parent.
            </p>
          </div>

          {/* Center: Navigation */}
          <div className="grid grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm">
                {features.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="relative inline-block text-gray-300 hover:text-white underline-grow transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                {company.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="relative inline-block text-gray-300 hover:text-white underline-grow transition-all duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 border border-gray-500 rounded-full hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
          © 2024 Petify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
