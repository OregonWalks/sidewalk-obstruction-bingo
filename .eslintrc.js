module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  ignorePatterns: [
    "*.css",
    "*.gif",
    "*.svg",
    "*.png",
    "*.ico",
    "README.md",
    "manifest.webmanifest",
    "node_modules/",
    "out/",
    "next.config.js",
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prefer-const": ["error", {
      destructuring: "all",
    }],
    "@typescript-eslint/no-use-before-define": "off"
  },
}
