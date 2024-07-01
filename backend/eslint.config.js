import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'warn', // Advertencia en lugar de error
            'eqeqeq': 'error',
            'no-console': 'warn',
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'always',
            ],
            'indent': [
                'error',
                4,
            ],

            'import/order': ['error', {
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always'
            }],
        }
    }
];