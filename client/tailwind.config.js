/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        work: "Work Sans",
      },
      colors: {
        "custom-gray": "#F4F4F5",
        "dark-gray": "#181A2A",
        "dark-gray-tint": "#242535",
        "dark-gray-shade": "#141624",
        "white-shade": "#E8E8EA",
      },
    },
    screens: {
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "800px" },
      sm: { max: "639px" },
    },
  },
  plugins: [flowbite.plugin()],
};
