/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#16233F', deep: '#0E1830' },
        gold: { DEFAULT: '#B8923A', light: '#D8B968' },
        paper: '#ECEDF1',
        ink: { DEFAULT: '#1B2233', soft: '#5A6178' },
        line: '#DBDDE3',
        leaf: { DEFAULT: '#2F6B4F', bg: '#E7F0EA' },
        amber: { DEFAULT: '#B8842B', bg: '#F8EFDD' },
        burgundy: { DEFAULT: '#8C2F39', bg: '#F6E7E8' },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
