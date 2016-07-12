module.exports = {
  entry: "./src/main.js",
  output: {
    path: './build',
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        "presets": ["es2015", "stage-0"],
        "plugins": []
      }
    }]
  },
  externals: {
    'snabbdom-jsx': 'snabbdom-jsx'
  }
};
