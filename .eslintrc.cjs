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
            // Define the configuration for `<script>` tag.
            // Script in `<script>` is assigned a virtual file name with the `.js` extension.
            files: ['**/*.astro/*.js', '*.astro/*.js'],
            parser: '@typescript-eslint/parser',
        },
        {
            files: ['*.mjs'],
            parserOptions: {
                sourceType: 'module',
            },
        },
    ],
};
