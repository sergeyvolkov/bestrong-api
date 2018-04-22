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
      arrays: 'always',
      objects: 'always',
    }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    strict: ['error', 'global'],
  }
};
