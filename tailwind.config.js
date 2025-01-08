/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dblack:{
          50: '#647070',
          100: '#5b6666',
          200: '#525b5b',
          300: '#495151',
          400: '#3f4747',
          500: '#363c3c',
          600: '#2d3232',
          700: '#242828',
          800: '#1a1d1d',
          900: '#111313',
        },
        dcyan:{
          300: '#f6fdfc',
          400: '#e6f9f7',
          500: '#d7f5f2',
          600: '#c7f1ed',
          700: '#b7ede7',
          800: '#a8e9e2',
          900: '#98e5dd',
        }
      },
      boxShadow:{
        '4xl':' 0 5px 30px 6px rgba(152,229,221,1))'
      },
      flex:{
        'r1':'1 1 0',
        'r2': '0 0 auto'
      },
      backgroundImage:{
        'book-keeper':'url("/src/assets/bk.jpg")'
      }
    },
  },
  plugins: [],
}

