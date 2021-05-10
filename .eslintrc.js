module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'require-await': 'off',
    'no-unused-expressions': 'off',
  },
}
