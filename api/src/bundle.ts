import fs from "fs/promises";
import webpack, { Configuration } from "webpack";
import path from "path";
import tmp from "tmp-promise";
import { user_library } from "shared/types/admin";

const library_dir = path.resolve(path.join(__dirname, "../../../lib"));

// just in case I get stupid an decide to compile it automatically (as if
// tsc couldn't just be run in a child process...):
// https://github.com/Microsoft/TypeScript/issues/6387

export async function bundle(lib: user_library) {
    // const package_json_file = await fs.readFile(
    //     path.join(lib.path, "package.json")
    // );
    // const package_json = JSON.parse(package_json_file.toString());

    const { path: dir, cleanup } = await tmp.dir();

    try {
        const config: Configuration = {
            entry: path.resolve(path.join(lib.path, "src/index")),
            target: "web",
            mode: "development",
            output: {
                path: dir,
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
                new webpack.container.ModuleFederationPlugin({
                    name: lib.name,
                    remotes: {
                        host: "host@/remoteEntry.js",
                    },
                    exposes: {
                        "./lib": path.join(lib.path, "src/index"),
                    },
                }),
            ],
        };

        // console.log("[Webpack bundler] bundling");
        await new Promise<void>((resolve, reject) => {
            try {
                webpack(config, (err, stats) => {
                    if (err) return reject(err);
                    if (stats && stats.hasErrors()) {
                        return reject(stats.toString());
                    } else {
                        resolve(undefined);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });

        const lib_path = path.join(library_dir, lib.name);
        // console.log("[Webpack bundler] removing old lib: ", lib_path);
        await fs.rm(lib_path, { force: true, recursive: true });
        // console.log("[Webpack bundler] renaming");
        await fs.rename(dir, lib_path);
        // console.log("[Webpack bundler] DONE!");
    } catch (err) {
        console.log("Something went wrong when building the library", err);
        throw err;
    } finally {
        try {
            await cleanup();
        } catch (err) {}
    }
}

// for testing
// usage:
//      cd api
//      node build/src/bundle.js ../default-lib
/*

if (process.argv.length > 2) {
    console.log("budling library: ", path.resolve(process.argv[2]));
    bundle({
        name: "test",
        path: path.resolve(process.argv[2]),
    });
}

*/
