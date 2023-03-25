module.exports = {
    extends: ['pikadude-ts', 'plugin:astro/recommended', 'plugin:jsx-a11y/recommended'],
    overrides: [
        {
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.astro'],
            },
            rules: {},
        },
        {
            files: ['*.mjs'],
            parserOptions: {
                sourceType: 'module',
            },
        },
    ],
};
