/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Custom color scheme based on app logo
        primary: {
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd4cc',
          300: '#ffb2a2', // Main peachy pink from logo heart
          400: '#ff9580',
          500: '#ff7a5e',
          600: '#f55d3d',
          700: '#e04020',
          800: '#b8301a',
          900: '#8f2515',
        },
        secondary: {
          50: '#f0f9fb',
          100: '#d9f0f5',
          200: '#b3e1eb',
          300: '#8dd2e1',
          400: '#67c3d7',
          500: '#4894a8', // Muted teal from logo hands
          600: '#3a7689',
          700: '#2d5a6b',
          800: '#1f3e4d',
          900: '#12232f',
        },
        accent: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
    },
  },
  plugins: [],
}