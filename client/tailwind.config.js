/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#153d35', 50: '#eef4f2', 100: '#d7e6e1', 400: '#2f6559', 500: '#1d4a40', 600: '#153d35', 700: '#0f2e28', 900: '#081a16' },
        cream: '#f7f8f3',
        ink: '#17211b',
        clay: { DEFAULT: '#d3784d', 50: '#fbf1ea', 100: '#f6ddc9', 500: '#d3784d', 600: '#b7602f' },
        mist: { 100: '#f2f5f1', 200: '#e5e9e1', 300: '#dce4dc', 500: '#809086', 600: '#718078', 700: '#506259' },
        success: { 50: '#e6f4ec', 500: '#23724e', 600: '#1c5c3f' },
        danger: { 50: '#fbe8e3', 500: '#a94e3d', 600: '#8f3f30' },
        amber: { 50: '#fdf1e0', 500: '#bd7a2b' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 30px rgba(21,61,53,0.08)',
        lift: '0 20px 45px rgba(21,61,53,0.14)',
      },
      borderRadius: {
        card: '10px',
      },
      maxWidth: {
        shell: '1120px',
      },
    },
  },
  plugins: [],
};
