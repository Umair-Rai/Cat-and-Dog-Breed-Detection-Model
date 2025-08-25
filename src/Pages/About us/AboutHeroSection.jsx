import React from 'react';

export default function AboutHeroSection() {
  return (
    <section
      className="relative w-full h-[80vh] flex items-center justify-center text-white overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: "url('/images/about-bg.jpg')", // Replace with your local or hosted image
          filter: 'brightness(0.6) blur(1px)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7D5FFF] to-[#5E9BFF] mix-blend-multiply" />

      {/* Centered Text Content */}
      <div
        className="relative z-10 text-center max-w-3xl px-6 py-24 md:py-28 animate-fadeInUp"
      >
        {/* Top Paw Print */}
       <span className="text-2xl md:text-3xl animate-pulse-slow">🐾</span>

        {/* Title */}
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight font-montserrat">
          <span className="text-white drop-shadow">We're</span>{' '}
          <span className="text-white drop-shadow-lg inline-flex items-center gap-2 hover:contrast-125 transition duration-300 ease-in-out">
            <span>🐾</span> Petify
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg md:text-xl font-medium text-white drop-shadow">
          Your Pet’s Best Friend
        </p>

        {/* Description */}
        <p className="mt-2 text-sm md:text-base text-white text-opacity-80 font-light drop-shadow-sm">
          AI-powered insights, personalized care, and a whole lot of tail wags.
        </p>

        {/* Bottom Paw */}
        <span className="text-2xl md:text-3xl animate-pulse-slow">🐾</span>
      </div>
    </section>
  );
}
