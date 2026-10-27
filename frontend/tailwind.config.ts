import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-dark': '#073B4C',
        'neo-bg': '#FFFAEB',
        'neo-blue': '#118AB2',
        'neo-pink': '#EF476F',
        'neo-yellow': '#FFD166',
        'neo-green': '#06D6A0',
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'DotGothic16', 'monospace'],
        body: ['var(--font-body)', 'VT323', 'monospace', 'sans-serif'],
      },
      boxShadow: {
        'neo-sm': 'none',
        'neo': 'none',
        'neo-md': 'none',
        'neo-lg': 'none',
        'neo-xl': 'none',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
