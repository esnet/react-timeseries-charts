//
// webpack.config.js to build an examples/website bundle
//

module.exports = {

    entry: {
        app: ["./examples/modules/main.jsx"]
    },

    output: {
        filename: "examples-bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: "babel",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader?limit=8192"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=[name].[ext]"
            }
        ]
    },

    externals: [
        {
            window: "window"
        }
    ],

    resolve: {
        extensions: ["", ".js", ".jsx", ".json"]
    }
};
