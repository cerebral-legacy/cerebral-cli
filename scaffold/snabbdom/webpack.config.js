module.exports = {
  module: {
    loaders: [{
      test: /\.css?$/,
      loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
    },
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015"],
        "plugins": [
          ["transform-react-jsx", { "pragma": "Component.DOM" }]
        ]
      }
    }]
  }
};
