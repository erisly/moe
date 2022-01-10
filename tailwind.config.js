const colors = require('tailwindcss/colors');

const config = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                'marquee-1': 'marquee-1 3s linear 1',
                'marquee-2': 'marquee-2 3s linear 1',
                'marquee-in': 'marquee-in 1s ease-in-out 1',
            },
            keyframes: {
                'marquee-1': {
                    '0%': { left: '100%' },
                    '100%': { left: '0' },
                },
                'marquee-2': {
                    '0%': { right: '0' },
                    '100%': { right: '100%' },
                },
                'marquee-in': {
                    '0%': { top: '-60px' },
                    '100%': { top: '0px' },
                },
            },
            transitionProperty: {
                slide: 'max-width, max-height, margin-left',
            },
        },
        colors: {
            erisly: {
                300: '#FDB4CB',
                400: '#FF6394',
                600: '#292841',
                700: '#26253C',
                800: '#242338',
                900: '#1C1B29',
            },
            white: '#ffffff',
            black: '#000000',
            discord: '#5865F2',
            github: '#171515',
            green: colors.green,
            red: colors.red,
        },
    },
    plugins: [],
};

config.theme.colors.primary = config.theme.colors.erisly['400'];

module.exports = config;
