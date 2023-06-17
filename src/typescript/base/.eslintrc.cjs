module.exports = {
    env: {
        es6: true,
        node: true,
    },
    overrides: [
        {
            files: [
                '*.js',
            ],
            extends: [
                '@matthiaskunnen/eslint-config-base',
            ],
        },
        {
            files: [
                '*.ts',
            ],
            extends: [
                '@matthiaskunnen/eslint-config-typescript',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['./tsconfig.json'],
                sourceType: 'module',
            },
        },
    ],
};
