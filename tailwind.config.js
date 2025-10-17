/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#eaeaea',
        'accent-magenta': '#e94057',
        'accent-orange': '#f27121',
        'accent-neon-yellow': '#fee140',
      },
    },
  },
  plugins: [],
}

