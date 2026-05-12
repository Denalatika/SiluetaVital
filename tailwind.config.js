/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2E7D32',
          DEFAULT: '#1E5631',
          dark: '#143b22'
        },
        secondary: {
          light: '#fdfdfc',
          DEFAULT: '#F9F9F6',
          dark: '#e0e0d6'
        },
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#E85D04'
        },
        background: '#F9F9F6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
