/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "geekblue-5": "#597EF7",
      "geekblue-7": "#1D39C4",
      "geekblue-9": "#061178",
      "lightblue": "#F0F5FF",
      "gray-1": "#FFF",
      "gray-2": "#FAFAFA",
      "gray-7": "#8C8C8C",
      "gray-8": "#CFCFCF",
      "gray-9": "#434343",
      "gray-10": "#262626"
    },
    fontFamily: {
      "inter": "Inter, Arial, Times, sans-serif"
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
