// webpack.config.js
const path = require('path');

module.exports = {
  entry: './microservices/common_services/server.js', // The entry point of your Node.js application
  target: 'node', // Set the target environment to Node.js
  output: {
    filename: 'common.js', // The name of the output bundle
    path: path.resolve(__dirname, 'dist'), // The directory where the bundle will be created
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  // Add any necessary loaders and plugins for your project
};
