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
          50: '#fdf2f3',
          100: '#fce4e6',
          200: '#f8c9cd',
          300: '#f29d94',
          400: '#e96d60',
          500: '#e94560',
          600: '#d63750',
          700: '#b82a41',
          800: '#962336',
          900: '#7a202e',
        },
        dark: {
          50: '#f0f0f0',
          100: '#d1d1d1',
          200: '#a3a3a3',
          300: '#747474',
          400: '#525252',
          500: '#3d3d3d',
          600: '#333333',
          700: '#2a2a2a',
          800: '#1e1e1e',
          900: '#1a1a2e',
          950: '#0f0f1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}