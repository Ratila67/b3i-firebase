const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    static: './public',
    hot: true, //si modification, redémarre et mets toi à jours
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  plugins: [
    new Dotenv()
  ]
};