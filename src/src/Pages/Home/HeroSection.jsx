import React from 'react';
import { Camera } from 'lucide-react'; // Optional icon package

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Left: Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Discover Your Pet’s Breed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload a photo and let our AI instantly identify breeds, suggest care tips,
            and connect you with the perfect products and breeders.
          </p>

          <button className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out relative overflow-hidden border-2 border-transparent hover:border-purple-500">
            <Camera className="h-5 w-5 mr-2" />
            Detect Your Breed
            <span className="absolute inset-0 rounded-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Right: Dog Image Card */}
        <div className="md:w-1/2">
          <div className="rounded-xl shadow-xl bg-white p-2 md:p-4">
            <img
              src="/Home.jpg" // Replace with your actual image path
              alt="Dog in modern home"
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
