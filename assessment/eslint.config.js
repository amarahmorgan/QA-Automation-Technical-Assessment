import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import importXPlugin from 'eslint-plugin-import-x';
export default defineConfig([

  // JavaScript base config
  js.configs.recommended,
  // Top level ignores
  {

    ignores: [

      '.features-gen/*/',

    ],

  },

  // TypeScript-specific config

  {

    files: ['*/.{ts,tsx,mts,cts}'],

    languageOptions: {

      parser: tseslint.parser,

      parserOptions: {

        project: './tsconfig.json',

        sourceType: 'module',
        ecmaVersion: 'latest',

      },

    },

    plugins: {

      '@typescript-eslint': tseslint.plugin,

      '@stylistic': stylistic

    },

    rules: {

      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false, ignoreIIFE: false }],

      '@typescript-eslint/explicit-function-return-type': 'error',

      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

      '@typescript-eslint/naming-convention': [

        'error',

        { selector: 'class', format: ['PascalCase'] },

        { selector: 'parameter', format: ['camelCase'] },

        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },

        { selector: 'property', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },

        { selector: 'property', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'require' },

        { selector: 'method', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'forbid' },

        { selector: 'method', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'forbid' },

      ],

      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/no-misused-new': 'error',

      '@typescript-eslint/no-unnecessary-condition': 'warn',

      '@typescript-eslint/prefer-string-starts-ends-with': 'error',

      '@typescript-eslint/restrict-plus-operands': 'error',

      '@typescript-eslint/restrict-template-expressions': [

        'error',

        {

          allowNumber: true,

          allowBoolean: true,

          allowAny: false,

          allowNullish: false,

        },

      ],

      '@typescript-eslint/triple-slash-reference': [

        'error',

        {

          path: 'never',

          types: 'never',

          lib: 'never',

        },

      ],

      '@stylistic/member-delimiter-style': [

        'error',

        {

          multiline: {

            delimiter: 'semi',

            requireLast: true,

          },

          singleline: {

            delimiter: 'semi',

            requireLast: true,

          },

        },

      ],

      'no-multiple-empty-lines': ['error', { max: 2 }],

      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': ['warn', { vars: 'local', args: 'none' }],

    },

  },

  // JavaScript JSDoc validation rules

  {

    files: ['*/.{js,mjs,cjs}'],

    plugins: {

      jsdoc: jsdocPlugin,

    },

    settings: {

      jsdoc: {

        mode: 'typescript',

      },

    },

    rules: {

      'jsdoc/check-param-names': 'error',

      'jsdoc/check-tag-names': 'error',

      'jsdoc/check-types': 'error',

      'jsdoc/no-undefined-types': 'error',

      'jsdoc/require-param': 'error',

      'jsdoc/require-param-type': 'error',

      'jsdoc/require-returns': 'error',

      'jsdoc/require-returns-type': 'error',

    },

  },

  // Shared JS/TS rules and globals

  {

    files: ['*/.{js,mjs,cjs,ts,tsx,mts,cts}'],

    languageOptions: {

      ecmaVersion: 'latest',

      sourceType: 'module',

      globals: {

        ...globals.node,

      },

    },

    plugins: {

      'import-x': importXPlugin,

      jsdoc: jsdocPlugin,

    },

    rules: {

      'brace-style': ['error', 'allman'],

      'curly': ['error', 'all'],

      'quotes': ['error', 'single'],

      'semi': ['error', 'always'],

      'max-len': ['error', { code: 200, tabWidth: 4 }],

      'spaced-comment': ['error', 'always'],

      'object-curly-spacing': ['error', 'always'],

      'prefer-template': 'error',

      'prefer-const': 'error',

      'import-x/first': 'error',

      'import-x/default': 'error',

      'import-x/export': 'error',

      'no-unused-vars': ['warn', { vars: 'local', args: 'none' }],

      'no-empty-pattern': 'off',

    },

  },

]);
