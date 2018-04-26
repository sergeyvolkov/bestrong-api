module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  rules: {
    'arrow-parens': ["error", "as-needed"],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
    }],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'node/exports-style': ['error', 'module.exports'],
    'object-curly-spacing': ['error', 'always'],
    semi: ['error', 'always'],
    strict: ['error', 'global'],
    quotes: ['error', 'single'],

  },
};
