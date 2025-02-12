/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'diagonal-streak': {
          '0%': { transform: 'translateX(0) translateY(0) rotate(-45deg)' },
          '100%': { transform: 'translateX(100vw) translateY(100vh) rotate(-45deg)' }
      }
      },
      animation: {
        'diagonal-streak': 'diagonal-streak 3s linear'
  },
  plugins: [],
    }
  }
}
