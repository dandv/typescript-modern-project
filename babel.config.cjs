module.exports = {
  plugins: [
    // Because Jest still doesn't support native ES modules - https://github.com/facebook/jest/issues/4842
    '@babel/plugin-transform-modules-commonjs',
  ],
};
