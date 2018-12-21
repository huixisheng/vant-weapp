module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: 'commonjs'
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import']
};
