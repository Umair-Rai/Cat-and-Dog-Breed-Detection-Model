import React, { useEffect, useRef, useState } from 'react';
import { HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';

const missions = [
  {
    title: 'Pet Love',
    icon: HeartIcon,
    bg: 'bg-purple-100',
    desc: 'Powered by Passion',
  },
  {
    title: 'Trust',
    icon: ShieldCheckIcon,
    bg: 'bg-blue-100',
    desc: 'Growing Every Day',
  },
  {
    title: 'Innovation',
    icon: SparklesIcon,
    bg: 'bg-green-100',
    desc: 'AI In Training',
  },
];

export default function OurMission() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState([false, false, false]);

  useEffect(() => {
  if (!containerRef.current) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          const idx = target.getAttribute('data-idx');
          setTimeout(() => {
            setVisible(v => v.map((vis, i) => (i === +idx ? true : vis)));
          }, idx * 300); // staggered by 0.3s
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const blocks = containerRef.current.querySelectorAll('.mission-block');
  blocks.forEach(el => observer.observe(el));

  return () => observer.disconnect();
}, []);


  return (
    <section className="w-full px-6 py-16 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold font-poppins mb-4 underline-grow">Our Mission</h2>
        <p className="text-gray-600 text-base md:text-lg mx-auto">
          We believe every pet deserves personalized care.
          Our AI technology helps pet parents make informed decisions
          for their furry family members.
        </p>
      </div>

      <div ref={containerRef} className="flex flex-col sm:flex-row sm:justify-center gap-6 max-w-5xl mx-auto">
        {missions.map(({ title, icon: Icon, bg, desc }, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`mission-block flex-1 bg-white rounded-2xl p-6 text-center transition-transform duration-300 ${
              visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } hover:shadow-purple-lg hover:scale-[1.03] cursor-default`}
          >
            <div
              className={`${bg} rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-110`}
            >
              <Icon className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 font-poppins">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
