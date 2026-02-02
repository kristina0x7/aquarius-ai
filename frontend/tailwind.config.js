/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-blue': '#00f3ff',
                'cyber-purple': '#9d00ff',
                'cyber-pink': '#ff00ff',
                'cyber-green': '#00ff9d',
                'dark-bg': '#0a0a14',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'scan': 'scan 4s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                },
                'scan': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [
        function({ addUtilities, theme }) {
            addUtilities({
                '.cyber-glow': {
                    'box-shadow':
                        `0 0 20px ${theme('colors.cyber-blue')}30,
             0 0 40px ${theme('colors.cyber-purple')}20`,
                },
                '.text-gradient': {
                    'background': `linear-gradient(to right, ${theme('colors.cyber-blue')}, ${theme('colors.cyber-purple')})`,
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    'color': 'transparent',
                },
            })
        }
    ],
}