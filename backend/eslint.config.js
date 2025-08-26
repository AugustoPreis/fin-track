const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: [
      '**/*.{js,mjs,cjs,ts}',
    ],
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'eslint.config.js',
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'no-undef': 'off',
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'quotes': ['warn', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    }
  }
];