/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 参考 our-time / Bing & Zhi Time 项目主题色
        cream: "#FFF9FC",
        'pink-soft': "#FFB6C1",
        'purple-light': "#E6D5F0",
        coral: "#FF6B6B",
        mint: "#7FD8BE",
        'rose-gold': "#B8958A",
        'warm-yellow': "#FFD97D",
        'light-red': "#FF9999",
        'text-primary': "#4A4A4A",
        'text-secondary': "#888888",
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%, 30%': { transform: 'scale(1.15)' },
          '20%, 40%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};