import React from 'react';

export default function BreedIdentifierSection() {
  return (
    <section className="w-full px-6 py-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left: Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Identify Your Pet’s Breed{' '}
            <span className="text-purple-600">Instantly</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto md:mx-0">
            Upload a photo and let Petify’s AI analyze and detect your pet's breed with precision.
            Get personalized care tips and connect with trusted breeders.
          </p>

          <button
            className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-purple-300 hover:ring-offset-2"
          >
            Detect Your Breed
          </button>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex justify-center">
          <div className="rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1619983081563-430f636027e3?auto=format&fit=crop&w=640&q=80"
              alt="Dog with digital scan overlay"
              className="rounded-xl object-cover w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
