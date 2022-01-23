const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    entry: "./src/index",
    target: "web",
    mode: "production",
    output: {
        publicPath: "auto",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },
    devtool: "source-map",

    plugins: [
        new ModuleFederationPlugin({
            name: "ras_lib_default",
            remotes: {
                host: "host@/remoteEntry.js",
            },
            exposes: {
                "./lib": "./src/index",
            },
        }),
    ],
};