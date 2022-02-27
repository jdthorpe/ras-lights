const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// const deps = require("./package.json").dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = "/";

    if (!config.module.rules) {
        config.module.rules = [];
    }
    config.module.rules.unshift({
        test: /\.md$/,
        type: "asset/source",
        // use: [
        //     {
        //         loader: "html-loader",
        //     },
        //     {
        //         loader: "markdown-loader",
        //         options: {
        //             // Pass options to marked
        //             // See https://marked.js.org/using_advanced#options
        //         },
        //     },
        // ],
    });

    if (!config.plugins) {
        config.plugins = [];
    }

    config.plugins.unshift(
        new ModuleFederationPlugin({
            name: "host",
            filename: "remoteEntry.js",
            remotes: {},
            exposes: {
                "./register": "./src/register",
            },
            //   shared: {
            //     ...deps,
            //     react: {
            //       singleton: true,
            //       requiredVersion: deps.react,
            //     },
            //     "react-dom": {
            //       singleton: true,
            //       requiredVersion: deps["react-dom"],
            //     },
            //   },
        })
    );

    return config;
};
