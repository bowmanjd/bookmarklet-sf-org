module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/no-cycle': 'off',
    'arrow-parens': [
      'error',
      'always',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'prefer-destructuring': 'off',
    'no-plusplus': 'off',
    'no-multi-assign': 'off',
    'max-len': [
      'error',
      100,
      2,
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    indent: [
      'error',
      2,
    ],
    'class-methods-use-this': 'off',
    'no-case-declarations': 'off',
    'array-callback-return': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-await-in-loop': 'off',
    'no-loop-func': 'off',
    'no-async-promise-executor': 'off',
  },
};
