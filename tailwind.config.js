const config = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
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
        },
    },
    plugins: [],
};

config.theme.colors.primary = config.theme.colors.erisly['400'];

module.exports = config;
