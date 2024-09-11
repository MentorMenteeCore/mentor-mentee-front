/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      'lightGray01': "#D9D9D9",
      'lightGray02': "#F5F5F5",
      'lightGray03': "#929292",
      'lightGray04': "#6E6E6E",
  
      'gray01': "#626262",
      'gray02' : "#A29E9E",
  
      'red01': "#FF0000",

      'blue01': "#3859D0",
      }
    },  
  },
  plugins: [],
}