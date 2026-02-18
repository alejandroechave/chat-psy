import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calm Color Palette
        primary: {
          DEFAULT: '#4A90E2',
          light: '#6BA3E8',
          lighter: '#8DB4EE',
          dark: '#2E5FA3',
        },
        background: {
          DEFAULT: '#F5F7FA',
          dark: '#E8ECEF',
        },
        accent: {
          DEFAULT: '#A8E6CF',
          light: '#C5F0D8',
          lighter: '#E0F5EA',
          dark: '#6DD4A8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
