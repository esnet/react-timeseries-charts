var webpack = require('webpack');

//
// This is used by npm build-global to build the global bundles into build/global
//

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {

  output: {
    library: ["ESnet", "ReactCharts"],
    libraryTarget: 'assign'
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

  node: {
    Buffer: false
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },

  externals: {
      //don't bundle the 'react' npm package with our bundle.js
      //but get it from a global 'React' variable
      'react': 'React',
      'react/addons': 'React',
  },

  plugins: plugins

};