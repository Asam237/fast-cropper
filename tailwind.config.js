/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "4rem",
          lg: "5rem",
          xk: "5rem",
        },
      },
      colors: {
        // Couleurs officielles OIM
        oim: {
          blue: "#0072BC",
          darkblue: "#005A94",
          navy: "#003D66",
          lightblue: "#E6F3FF",
          gray: "#F8F9FA"
        },
        primary: {
          DEFAULT: "#0072BC",
          50: "#E6F3FF",
          100: "#CCE7FF",
          200: "#99CFFF",
          300: "#66B7FF",
          400: "#339FFF",
          500: "#0072BC",
          600: "#005A94",
          700: "#004270",
          800: "#002A4C",
          900: "#001228"
        },
        secondary: {
          DEFAULT: "#005A94",
        },
        accent: {
          DEFAULT: "#003D66",
        }
      },
      fontFamily: {
        sans: ['var(--font-euclid-ui-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'oim': '0 25px 50px -12px rgba(0, 114, 188, 0.25)',
        'oim-lg': '0 35px 60px -12px rgba(0, 114, 188, 0.4)',
      }
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen md": {
            maxWidth: "1100px",
          },
          "@screen lg": {
            maxWidth: "1150px",
          },
          "@screen xl": {
            maxWidth: "1200px",
          },
        },
      });
    },
  ],
};