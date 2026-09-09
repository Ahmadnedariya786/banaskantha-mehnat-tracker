/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gujarati: ['"Hind Vadodara"', '"Noto Sans Gujarati"', 'sans-serif'],
        numbers: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        bg:   'rgb(var(--bg) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        txt:  'rgb(var(--text) / <alpha-value>)',
        sub:  'rgb(var(--sub) / <alpha-value>)',
        acc:  'rgb(var(--acc) / <alpha-value>)',
        acc2: 'rgb(var(--acc2) / <alpha-value>)',
        brd:  'rgb(var(--brd) / <alpha-value>)',
        inp:  'rgb(var(--inp) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      boxShadow: {
        glass: '0 8px 32px rgb(var(--shadow-color) / var(--shadow-alpha))',
      },
      spacing: {
        '18': '4.5rem',
      },
      transitionDuration: {
        '350': '350ms',
      }
    },
  },
  plugins: [],
}
