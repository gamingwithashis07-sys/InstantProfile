import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#fdf8f3',
          100: '#f5e6d3',
          200: '#e8d5c4',
          300: '#d4a373',
          400: '#e8a87c',
          500: '#f4a261',
          600: '#e07c3c',
          700: '#c0652e',
          800: '#9a4f23',
          900: '#7a3d1a',
        },
        neu: {
          light: '#fff5eb',
          dark: '#c4b5a5',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.25)',
        },
      },
      boxShadow: {
        'clay': '8px 8px 16px #c4b5a5, -8px -8px 16px #fff5eb',
        'clay-sm': '4px 4px 8px #c4b5a5, -4px -4px 8px #fff5eb',
        'clay-lg': '12px 12px 24px #c4b5a5, -12px -12px 24px #fff5eb',
        'neu': '5px 5px 10px #c4b5a5, -5px -5px 10px #fff5eb',
        'neu-sm': '3px 3px 6px #c4b5a5, -3px -3px 6px #fff5eb',
        'neu-inset': 'inset 3px 3px 6px #c4b5a5, inset -3px -3px 6px #fff5eb',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'clay': '24px',
        'neu': '16px',
        'glass': '20px',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
