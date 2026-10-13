/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#6B1D2A', dark: '#45101a', light: '#8e2c3d' },
        marigold: { DEFAULT: '#F6B21B', deep: '#E8890C', soft: '#FCE7A8' },
        cream: { DEFAULT: '#FAF3E3', dark: '#F0E4C8' },
        charcoal: { DEFAULT: '#2B2623', soft: '#5c534d' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      // Print-like, near-square edges. rounded-full stays available for true circles only
      // (spinner, toggle switch, tick icon).
      borderRadius: {
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
      },
    },
  },
  plugins: [],
};
