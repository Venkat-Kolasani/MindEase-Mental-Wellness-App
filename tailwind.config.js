/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // MindEase Warm Orange-Beige Mindful Palette
        'warm-charcoal': {
          50: '#faf9f7',
          100: '#f0ede8',
          200: '#e2ddd5',
          300: '#cfc7bb',
          400: '#b8ad9e',
          500: '#a39485',
          600: '#8b7d6f',
          700: '#73675c',
          800: '#5d544c',
          900: '#2D2520', // Warm Charcoal (base)
        },
        'terracotta': {
          50: '#fef7f3',
          100: '#fdeee6',
          200: '#fad9cc',
          300: '#f6bfa8',
          400: '#f09b7a',
          500: '#E8956B', // Terracotta (base)
          600: '#d97a4f',
          700: '#c4633a',
          800: '#a15232',
          900: '#82452e',
        },
        'warm-beige': {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf2e7',
          300: '#f5e8d3',
          400: '#eed9b8',
          500: '#F4E4BC', // Warm Beige (base)
          600: '#e0c896',
          700: '#c9a96f',
          800: '#b08d54',
          900: '#8f7347',
        },
        'soft-cream': {
          50: '#fefefe',
          100: '#fefcfa',
          200: '#fcf8f2',
          300: '#f9f2e7',
          400: '#f4e9d6',
          500: '#F7F0E8', // Soft Cream (base)
          600: '#e8d5c0',
          700: '#d4b896',
          800: '#bc9a6f',
          900: '#9d7f5a',
        },
        'muted-sage': {
          50: '#f7f8f6',
          100: '#eef0ec',
          200: '#dde1d7',
          300: '#c4ccbb',
          400: '#a7b299',
          500: '#B5C0A7', // Muted Sage (base)
          600: '#9aa688',
          700: '#7f8a6f',
          800: '#69725c',
          900: '#575e4e',
        },
        'dusty-orange': {
          50: '#fef8f5',
          100: '#fdeee8',
          200: '#fad9cc',
          300: '#f5bfa5',
          400: '#ee9b73',
          500: '#D4956A', // Dusty Orange (base)
          600: '#c17a4f',
          700: '#a6633f',
          800: '#885237',
          900: '#6f4531',
        },
        'warm-taupe': {
          50: '#faf9f8',
          100: '#f2f0ed',
          200: '#e6e1db',
          300: '#d5cdc3',
          400: '#c0b4a6',
          500: '#C9B99B', // Warm Taupe (base)
          600: '#b5a085',
          700: '#9a8670',
          800: '#7f6f5d',
          900: '#695c4e',
        },
        // Keep primary as terracotta for backward compatibility
        primary: {
          50: '#fef7f3',
          100: '#fdeee6',
          200: '#fad9cc',
          300: '#f6bfa8',
          400: '#f09b7a',
          500: '#E8956B',
          600: '#d97a4f',
          700: '#c4633a',
          800: '#a15232',
          900: '#82452e',
        },
        // Keep calm as muted-sage alias
        calm: {
          50: '#f7f8f6',
          100: '#eef0ec',
          200: '#dde1d7',
          300: '#c4ccbb',
          400: '#a7b299',
          500: '#B5C0A7',
          600: '#9aa688',
          700: '#7f8a6f',
          800: '#69725c',
          900: '#575e4e',
        },
        // Keep warm as dusty-orange alias
        warm: {
          50: '#fef8f5',
          100: '#fdeee8',
          200: '#fad9cc',
          300: '#f5bfa5',
          400: '#ee9b73',
          500: '#D4956A',
          600: '#c17a4f',
          700: '#a6633f',
          800: '#885237',
          900: '#6f4531',
        }
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
        'soft-glow': 'softGlow 4s ease-in-out infinite alternate',
        'warm-breathe': 'warmBreathe 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gentlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        softGlow: {
          '0%': { boxShadow: '0 0 20px rgba(232, 149, 107, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(232, 149, 107, 0.5)' },
        },
        warmBreathe: {
          '0%, 100%': { transform: 'scale(1)', backgroundColor: '#E8956B' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#D4956A' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};