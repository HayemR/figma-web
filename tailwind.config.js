/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#39f6ff',
          purple: '#a855f7',
          pink: '#ff4fd8',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(57, 246, 255, 0.25)',
        glowStrong: '0 0 45px rgba(168, 85, 247, 0.35)',
      },
      backgroundImage: {
        hero: 'radial-gradient(1200px circle at 30% 30%, rgba(57,246,255,0.25), transparent 55%), radial-gradient(900px circle at 70% 25%, rgba(168,85,247,0.28), transparent 55%), linear-gradient(135deg, #19d3e2 0%, #7c3aed 55%, #db2777 100%)',
        soft: 'linear-gradient(135deg, rgba(25, 211, 226, 0.18) 0%, rgba(124, 58, 237, 0.18) 50%, rgba(219, 39, 119, 0.18) 100%)',
        panel:
          'radial-gradient(800px circle at 20% 0%, rgba(57,246,255,0.18), transparent 50%), radial-gradient(700px circle at 80% 10%, rgba(255,79,216,0.18), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      fontFamily: {
        display: [
          'ui-sans-serif',
          'system-ui',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
