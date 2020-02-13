const path = require("path");
const SRC_PATH = path.join(__dirname, "../src");

module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: [SRC_PATH],
        use: [
            {
                loader: require.resolve("awesome-typescript-loader"),
                options: {
                    configFileName: "./tsconfig.json"
                }
            }
        ]
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
};
