import React, { useEffect, useRef, useState } from 'react';
import { CameraIcon, CpuChipIcon, HeartIcon } from '@heroicons/react/24/solid';

const steps = [
  {
    icon: CameraIcon,
    iconBg: 'bg-purple-600',
    title: 'Upload a Pet Photo',
    desc: 'Take a clear photo of your pet or upload an existing one from your device.',
  },
  {
  icon: CpuChipIcon,
  iconBg: 'bg-blue-600',
  title: 'AI Detects the Breed',
  desc: 'Our advanced AI analyzes your pet’s features and identifies the breed with high accuracy.',
  },
  {
    icon: HeartIcon,
    iconBg: 'bg-green-500',
    title: 'Get Personalized Matches',
    desc: 'Receive tailored product recommendations, and breeding service suggestions.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full px-6 py-16 bg-gradient-to-r from-[#f9f9fc] to-[#f1f6fd] font-poppins"
    >
      <h2 className="text-3xl font-bold mb-12 underline-grow ml-[47%]">How It Works</h2>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className={`
                flex-1 bg-white rounded-2xl p-6 text-center
                shadow-md transition-all duration-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                hover:shadow-[0_4px_20px_rgba(109,40,217,0.4)] hover:scale-105
              `}
            >
              <div className={`w-16 h-16 mx-auto rounded-full ${step.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-base">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
