//
// webpack.config.js to build an examples bundle
// for use with the examples site. To use this in
// another project you do not have to build anything.
//

module.exports = {

  entry: {
    app: ['./examples/modules/main.jsx']
  },

  output: {
    filename: 'examples-bundle.js'
  },

  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel?optional=es7.objectRestSpread' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[name].[ext]" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};