/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        google: {
          'text-gray': '#3c4043',
          'button-blue': '#1a73e8',
          'button-blue-hover': '#5195ee',
          'button-dark': '#202124',
          'button-dark-hover': '#555658',
          'button-border-light': '#dadce0',
          'logo-blue': '#4285f4',
          'logo-green': '#34a853',
          'logo-yellow': '#fbbc05',
          'logo-red': '#ea4335',
        },
      },
    },
  },
  plugins: [],
};
