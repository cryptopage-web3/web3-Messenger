module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'no-unused-vars': 1,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/jsx-closing-tag-location': 1,
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'max-lines-per-function': [
      'error',
      {
        max: 30,
        IIFEs: true
      }
    ]
  }
}
