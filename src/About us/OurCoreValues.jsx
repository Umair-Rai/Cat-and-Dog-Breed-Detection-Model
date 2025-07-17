import React, { useEffect, useRef, useState } from 'react';

const coreValues = [
  {
    title: 'Trust',
    description: 'Building lasting relationships with pet parents.',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    shadow: 'hover:shadow-purple-400',
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 11c.8 0 1.5.4 2 .9l3.3 3.3a2.8 2.8 0 01-4 4l-1.6-1.6-1.6 1.6a2.8 2.8 0 01-4-4l3.3-3.3c.5-.5 1.2-.9 2-.9z"
      />
    ),
  },
  {
    title: 'Innovation',
    description: 'Using technology to create smarter pet care.',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    shadow: 'hover:shadow-blue-400',
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 3v4m0 10v4m8-8h-4m-8 0H3m13.7-5.3l-2.8 2.8m0 4l2.8 2.8M6.3 6.3l2.8 2.8m0 4l-2.8 2.8"
      />
    ),
  },
  {
    title: 'Pet-First',
    description: 'Every feature is built with pets in mind first.',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
    shadow: 'hover:shadow-green-400',
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 13.682a4.5 4.5 0 010-6.364z"
      />
    ),
  },
];

const OurCoreValues = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState([false, false, false]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-idx');
            setTimeout(() => {
              setVisible(prev =>
                prev.map((v, i) => (i === +index ? true : v))
              );
            }, index * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const blocks = sectionRef.current.querySelectorAll('.value-card');
    blocks.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-br from-white to-violet-50 font-poppins">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold underline-grow">
          Our Core Values
        </h2>
      </div>

      <div
        ref={sectionRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {coreValues.map((value, idx) => (
          <div
            key={idx}
            data-idx={idx}
            className={`value-card bg-white rounded-2xl p-6 text-center shadow-md transition-all duration-300 hover:scale-105 ${value.shadow} ${
              visible[idx]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto rounded-full ${value.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}
              aria-label={`${value.title} Icon`}
            >
              <svg
                className={`w-8 h-8 ${value.iconColor}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {value.iconPath}
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {value.title}
            </h3>
            <p className="text-sm text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurCoreValues;
