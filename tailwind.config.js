/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#3531FF",
        blue_50: "rgba(53, 49, 255, 0.5)",
        blue_30: "rgba(53, 49, 255, 0.3)",
        blue_20: "rgba(53, 49, 255, 0.2)",
        dark_blue: "#120F9C",
        medium_blue: "#6562FF",
        light_blue: "#A4A3FF",
        light_purple: "#6562FF",
        light_purple2: "#E3E2FF",
        lightest_purple: "#D6D6FF",
        grey: "#959595",
        light_grey: "#F6F6F6",
        red: "#FF6969",
        light_red: "#FFB8B8",
        lightest_red: "#FFD1D1",
      },
      animation: {
        fade: "fadeOut 400ms ease-in-out",
      },
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { opacity: 0, marginTop: "-20px" },
          "100%": { opacity: 1, marginTop: 0 },
        },
      }),
    },
  },
  plugins: [],
};
