module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
    }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    strict: ['error', 'global'],
    'object-curly-spacing': ['error', 'always'],
  },
};
