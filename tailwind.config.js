/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#7e5bef", // Petify brand purple
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        "purple-lg": "0 4px 20px rgba(109, 40, 217, 0.4)", // Custom brand glow
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
        fadeIn: "fadeIn 0.8s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".underline-grow": {
          position: "relative",
          display: "inline-block",
        },
        ".underline-grow::after": {
          content: "''",
          position: "absolute",
          left: "0",
          bottom: "0",
          width: "100%",
          height: "2px",
          backgroundColor: "#7e5bef",
          transform: "scaleX(0)",
          transformOrigin: "bottom left",
          transition: "transform 0.3s ease-out",
        },
        ".underline-grow:hover::after": {
          transform: "scaleX(1)",
        },
      });
    },
  ],
};
