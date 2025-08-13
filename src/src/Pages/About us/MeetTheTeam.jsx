export default function MeetTheTeam() {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: '/team/sarah.jpg', // replace with actual paths
    },
    {
      name: 'Mike Johnson',
      role: 'CTO',
      image: '/team/mike.jpg',
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      image: '/team/emily.jpg',
    },
  ];

  return (
    <section className="w-full bg-[#f9fafb] py-16 px-4">
      <h2 className="text-4xl font-semibold text-center bold text-gray-800 mb-10 underline-grow ml-[42%] w-max">
        Meet the Team
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm hover:shadow-purple-lg hover:scale-105 transition-shadow duration-300 ease-in-out transform p-6 w-full max-w-sm text-center animate-fadeIn"
          >
            <img
              src={member.image}
              alt={`${member.name} - ${member.role}`}
              className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
