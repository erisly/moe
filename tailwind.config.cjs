/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                background: {
                    100: '#282740',
                    200: '#35344C',
                    300: '#413F66',
                    400: '#292841',
                    500: '#26253C',
                    600: '#242338',
                    700: '#1C1B29',
                    DEFAULT: '#292841',
                },
                erisly: {
                    primary: '#FF6394',
                    alt: '#FF6663',
                    dark: '#FF4782',
                    'dark-2': '#FF2E70',
                    light: '#FF7AA4',
                    'light-2': '#FF94B6',
                    secondary: '#FEB5CC',
                },
            },
        },
    },
    plugins: [],
};
