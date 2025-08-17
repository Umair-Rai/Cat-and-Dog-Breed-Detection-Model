import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const products = [
  {
    id: '001',
    handle: 'premium-food-bowl-set',
    name: 'Premium Food Bowl Set',
    price: '$49.99',
    features: ['Non-slip base', 'Stainless steel', 'Perfect for medium to large breeds'],
    imgPrimary: '/images/bowl-set-1.jpg',
    imgHover: '/images/bowl-set-2.jpg',
  },
  {
    id: '002',
    handle: 'smart-puzzle-toy',
    name: 'Smart Puzzle Toy',
    price: '$29.99',
    features: ['Interactive puzzle', 'Mental stimulation', 'Engaging for pets'],
    imgPrimary: '/images/puzzle-toy-1.jpg',
    imgHover: '/images/puzzle-toy-2.jpg',
  },
  {
    id: '003',
    handle: 'luxury-pet-bed',
    name: 'Luxury Pet Bed',
    price: '$89.99',
    features: ['Memory foam comfort', 'Removable & washable cover', 'Great for small to medium dogs'],
    imgPrimary: '/images/pet-bed-1.jpg',
    imgHover: '/images/pet-bed-2.jpg',
  },
  {
    id: '004',
    handle: 'grooming-kit',
    name: 'Pet Grooming Kit',
    price: '$39.99',
    features: ['Low noise clipper', 'Washable blades', 'Ergonomic handle'],
    imgPrimary: '/images/grooming-kit-1.jpg',
    imgHover: '/images/grooming-kit-2.jpg',
  },
  {
    id: '005',
    handle: 'collar-light',
    name: 'LED Collar Light',
    price: '$19.99',
    features: ['Waterproof', 'Rechargeable', 'Multiple colors'],
    imgPrimary: '/images/collar-light-1.jpg',
    imgHover: '/images/collar-light-2.jpg',
  },
];

const ProductSlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    const maxStart = products.length - visibleCount;
    setStartIndex((prev) => Math.min(prev + visibleCount, maxStart));
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="bg-white py-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pet Products</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= products.length}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleProducts.map((p) => (
          <a
            key={p.id}
            id={`CardLink-template--23989466726719__featured_collection_tAcHjR-${p.id}`}
            href={`/products/${p.handle}`}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden group shadow-md hover:shadow-lg hover:shadow-purple-400 transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={p.imgPrimary}
                alt={p.name}
                className="object-cover w-full h-full transition-opacity duration-500"
              />
              <img
                src={p.imgHover}
                alt={`${p.name} alternate`}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-2">{p.name}</h3>
              <ul className="text-gray-600 text-sm mb-3 list-disc list-inside space-y-1">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="text-purple-600 font-bold text-base">{p.price}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
