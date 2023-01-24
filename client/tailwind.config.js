/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/components/**/*.{html,ts,tsx,js,jsx}",
    "./client/src/views/**/*.{html,ts,tsx,js,jsx}",
    "./client/src/partials/**/*.{html,ts,tsx,js,jsx}",
    "./client/src/**/*.{html,ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["corporate", "business"]
  }
}
