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
        // AERIX Brand Colors
        brand: {
          cyan: '#00BFFF',
          orange: '#FF6200',
          navy: '#0A0E1A',
          'navy-light': '#0F1629',
          'navy-card': '#141C35',
          'navy-border': '#1E2A4A',
        },
        aerix: {
          primary: '#00BFFF',
          accent: '#FF6200',
          dark: '#0A0E1A',
          card: '#141C35',
          border: '#1E2A4A',
          text: '#CBD5E1',
          muted: '#64748B',
        }
      },
      fontFamily: {
        heading: ['var(--font-orbitron)', 'monospace'],
        body: ['var(--font-exo2)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aerix-hero': 'linear-gradient(135deg, #0A0E1A 0%, #0F1629 50%, #0A1628 100%)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 191, 255, 0.3)',
        'orange-glow': '0 0 20px rgba(255, 98, 0, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 191, 255, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 191, 255, 0.6)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
