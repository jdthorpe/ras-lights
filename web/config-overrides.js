const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// const deps = require("./package.json").dependencies;

module.exports = function override(config, env) {
    config.output.publicPath = "/ras-lights/";

    // ------------------------------
    // markdown configuration
    // ------------------------------
    if (!config.module.rules) {
        config.module.rules = [];
    }
    config.module.rules.unshift({
        test: /\.md$/,
        type: "asset/source",
    });

    // ------------------------------
    // module federatoin configuration
    // ------------------------------
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
        })
    );

    return config;
};
