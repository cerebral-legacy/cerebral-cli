const webpack = require('webpack');
const path = require('path');
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
}

module.exports = {
  entry: path.resolve('src', 'main.js'),
  output: {
    path: path.resolve('build'),
    publicPath: '/build',
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: ['inferno']
      }
    }]
  },
  plugins: plugins
};
