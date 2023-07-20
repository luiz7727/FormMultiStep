/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.tsx",
  ],
  theme: {
<<<<<<< HEAD
    extend: {},
    screens: {
      'sm': {'min': '360px', 'max': '767px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '1024px', 'max': '1279px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': {'min': '1536px'},
=======
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    screens: {
      'sm': { 'min': '360px', 'max': '767px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': { 'min': '768px', 'max': '1023px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': { 'min': '1024px', 'max': '1279px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': { 'min': '1280px', 'max': '1535px' },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': { 'min': '1536px' },
>>>>>>> 930706628d3c857662b7c280609a9e7cd8174de3
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
}