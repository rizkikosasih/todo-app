/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      mono: ['Roboto Mono', 'monospace'],
      caramel: ['Caramel', 'sans-serif']
    },
    screens: {
      phone: '0px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px'
    },
    extend: {}
  },
  plugins: []
});
