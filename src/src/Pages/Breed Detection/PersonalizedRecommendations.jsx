import React, { useState, useEffect } from 'react';

const mockRecommendations = {
  products: Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    image: 'https://via.placeholder.com/150',
    title: `Pet Product ${i + 1}`,
    description: 'Tailored for your pet needs.',
    price: `$${(i + 1) * 10}.00`,
  })),
  breeders: Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    image: 'https://via.placeholder.com/150',
    title: `Breeder Service ${i + 1}`,
    description: 'Connect with trusted breeders.',
    price: `$${(i + 1) * 20}.00`,
  })),
};

export default function PersonalizedRecommendations({ isUploaded }) {
  const [showSection, setShowSection] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (isUploaded) {
      const timer = setTimeout(() => setShowSection(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isUploaded]);

  if (!showSection) return null;

  const activeData = mockRecommendations[activeTab];

  return (
    <section className="w-full px-4 py-12 bg-purple-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Personalized Recommendations
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {['products', 'breeders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition
              ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600'
              }`}
          >
            {tab === 'products' ? 'Products' : 'Breeding Services'}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-4 transition transform hover:shadow-[0_4px_20px_rgba(109,40,217,0.4)]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <p className="text-purple-600 font-bold mb-3">{item.price}</p>
            <button className="w-full py-2 bg-purple-600 text-white rounded-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_4px_20px_rgba(109,40,217,0.4)]">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
