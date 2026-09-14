/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#08080C',
          light: '#12121A',
          card: '#0E0E15'
        },
        dragonfruit: {
          start: '#FF007A',
          end: '#7928CA'
        },
        citrus: {
          start: '#FF9900',
          end: '#FF0055'
        },
        matcha: {
          start: '#00F5A0',
          end: '#00D9F6'
        },
        passion: {
          start: '#9D00FF',
          end: '#FF007A'
        },
        mango: {
          start: '#FFB800',
          end: '#FF5E00'
        }
      },
      fontFamily: {
        display: ['Syne', 'Clash Display', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      backdropBlur: {
        glass: '24px',
        heavy: '40px'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 40px -10px var(--glow-color, rgba(255, 0, 122, 0.4))'
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.8', transform: 'scale(1.08)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        }
      }
    },
  },
  plugins: [],
}
