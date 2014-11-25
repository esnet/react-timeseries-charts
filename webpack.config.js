// webpack.config.js
module.exports = {
  entry: './examples/modules/main.jsx',
  output: {
    filename: 'examples-bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'jsx-loader?harmony' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};