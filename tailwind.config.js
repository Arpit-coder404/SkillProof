/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F6F2',
          card: '#FFFFFF',
          subtle: '#F2F0EB',
          accent: '#EDEBE4',
        },
        ink: {
          DEFAULT: '#20231F',
          light: '#3C4039',
          muted: '#777B75',
          faint: '#A6AAA3',
        },
        forest: {
          DEFAULT: '#234B3C',
          deep: '#18362B',
          light: '#2D614E',
          surface: '#EEF3F0',
        },
        sage: {
          DEFAULT: '#DCE5DC',
          light: '#EBF1EB',
          border: '#CAD7CA',
          dark: '#58735A',
        },
        border: {
          DEFAULT: '#E5E4DE',
          subtle: '#ECEBE5',
          dark: '#C8C7C0',
        },
        terracotta: {
          DEFAULT: '#D77A45',
          dark: '#B85E2B',
          light: '#F8ECE4',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        editorial: '0 4px 20px -2px rgba(32, 35, 31, 0.06)',
        lift: '0 10px 30px -4px rgba(32, 35, 31, 0.08)',
      },
    },
  },
  plugins: [],
}

