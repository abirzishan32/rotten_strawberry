/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0e1013',
          soft: '#14171b',
          elevated: '#1c2027',
          border: '#262b33',
        },
        surface: {
          light: '#ffffff',
          'light-soft': '#f4f5f7',
          'light-elevated': '#ffffff',
          'light-border': '#e4e6eb',
        },
        ink: {
          DEFAULT: '#eef1f5',
          muted: '#9aa3af',
          faint: '#5b6472',
        },
        inkLight: {
          DEFAULT: '#14171b',
          muted: '#5b6472',
          faint: '#8a919c',
        },
        brand: {
          DEFAULT: '#00e054',
          dim: '#00b845',
          orange: '#ff8000',
          blue: '#40bcf4',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
    },
  },
  plugins: [],
};
