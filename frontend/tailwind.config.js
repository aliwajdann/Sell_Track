/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--primary) / <alpha-value>)',
                'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
                accent: 'rgb(var(--accent) / <alpha-value>)',
                'bg-main': 'rgb(var(--bg-main) / <alpha-value>)',
                'text-main': 'rgb(var(--text-main) / <alpha-value>)',
                'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                sora: ['Sora', 'sans-serif'],
            },
        },
    },
    plugins: [],
}