/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  darkMode: 'class', // مهم لتفعيل Dark Mode عبر class="dark"
  theme: {
    extend: {
      colors: {
        primary: '#047857',
        darkPrimary: '#333333',    // رمادي داكن للوضع الليلي
        background: '#374151',     // خلفية عادية
        foreground: '#171717',     // نص عادي
        'background-dark': '#121212',  // خلفية داكنة
        'foreground-dark': '#EDEDED'   // نص داكن
      },
      fontFamily: {
  cairo: ['Cairo', 'sans-serif'],
},

    },
  },
  plugins: [],
}