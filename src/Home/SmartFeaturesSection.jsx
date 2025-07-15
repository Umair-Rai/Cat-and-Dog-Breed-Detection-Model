import React from 'react';
import {
  Camera,
  ShoppingBag,
  Users,
  Heart,
} from 'lucide-react';

const features = [
  {
    title: 'Breed Detection',
    icon: <Camera className="h-6 w-6 text-purple-500" />,
    text: 'Instant AI-powered breed identification from any photo',
  },
  {
    title: 'Smart Shopping',
    icon: <ShoppingBag className="h-6 w-6 text-purple-500" />,
    text: 'Personalized product recommendations for your pet’s needs',
  },
  {
    title: 'Breeder Connect',
    icon: <Users className="h-6 w-6 text-purple-500" />,
    text: 'Find trusted breeders in your area with verified reviews',
  },
  {
    title: 'Care Tips',
    icon: <Heart className="h-6 w-6 text-purple-500" />,
    text: 'Personalized care guides based on your pet’s breed and age',
  },
];

const SmartFeaturesSection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-100 via-purple-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Smart Pet Intelligence</h2>
        <p className="text-gray-600 mb-12">
          AI-powered tools to understand and care for your furry friends
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ title, icon, text }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-400 transition-shadow duration-300 text-left"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFeaturesSection;
