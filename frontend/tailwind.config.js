/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark5: "rgb(13, 13, 13)",
        dark4: "rgb(20, 20, 20)",
        dark3: "rgb(28, 28, 28)",
        dark2: "rgb(36, 36, 36)",
        dark1: "rgb(43, 43, 43)",
        light1: "rgb(242, 242, 242)",
        light2: "rgb(235, 235, 235)",
        light3: "rgb(227, 227, 227)",
        light4: "rgb(219, 219, 219)",
        light5: "rgb(212, 212, 212)",
        red1: "rgb(170, 30, 60)",
        red2: "rgb(183, 5, 60)",
        red3: "rgb(170, 5, 60)",
        red4: "rgb(160, 5, 60)",
        red5: "rgb(150, 5, 60)",
      },
      fontFamily: {
        secular: ["Secular", "sans-serif"],
        anton: ["Anton", "sans-serif"],
      },
    },
  },
  plugins: [],
};
