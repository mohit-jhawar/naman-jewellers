/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#fefbf3',
                    100: '#fdf6e3',
                    200: '#fae8bf',
                    300: '#f7da9b',
                    400: '#f1be53',
                    500: '#eba20b',
                    600: '#d4920a',
                    700: '#b17a08',
                    800: '#8e6207',
                    900: '#745005',
                },
                luxury: {
                    dark: '#1a1a1a',
                    darker: '#0f0f0f',
                    light: '#f5f5f5',
                }
            },
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-luxury': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-gold': 'linear-gradient(135deg, #f1be53 0%, #eba20b 100%)',
            },
        },
    },
    plugins: [],
}
