// eslint.config.js
import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['index.js'] },
  js.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 13,
        requireConfigFile: false,
        sourceType: 'module',
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react': reactPlugin,
    },
    rules: {
      //ESLint Core
      'no-dupe-keys': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'arrow-spacing': 'warn',

      //Plugin React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-duplicate-props': 'warn',
      'react/void-dom-elements-no-children': 'warn',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'warn',
      'react/jsx-filename-extension': 'off',
      'react/jsx-uses-vars': 'warn',

      //Plugin React Hooks
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];