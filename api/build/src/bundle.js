"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = void 0;
const webpack_1 = __importDefault(require("webpack"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tmp_promise_1 = __importDefault(require("tmp-promise"));
const library_dir = path_1.default.resolve(path_1.default.join(__dirname, "../../../lib"));
// just in case I get stupid an decide to compile it automatically (as if
// tsc couldn't just be run in a child process...):
// https://github.com/Microsoft/TypeScript/issues/6387
async function bundle(lib) {
    // const package_json_file = await fs.readFile(
    //     path.join(lib.path, "package.json")
    // );
    // const package_json = JSON.parse(package_json_file.toString());
    const { path: dir, cleanup } = await tmp_promise_1.default.dir();
    try {
        const config = {
            entry: path_1.default.resolve(path_1.default.join(lib.path, "src/index")),
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
                new webpack_1.default.container.ModuleFederationPlugin({
                    name: lib.name,
                    remotes: {
                        host: "host@/remoteEntry.js",
                    },
                    exposes: {
                        "./lib": path_1.default.join(lib.path, "src/index"),
                    },
                }),
            ],
        };
        // console.log("[Webpack bundler] bundling");
        await new Promise((resolve, reject) => {
            try {
                (0, webpack_1.default)(config, (err, stats) => {
                    if (err)
                        return reject(err);
                    if (stats && stats.hasErrors()) {
                        return reject(stats.toString());
                    }
                    else {
                        resolve(undefined);
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
        const lib_path = path_1.default.join(library_dir, lib.name);
        // console.log("[Webpack bundler] removing old lib: ", lib_path);
        await fs_extra_1.default.remove(lib_path); // , { force: true, recursive: true }
        // console.log("[Webpack bundler] renaming");
        await fs_extra_1.default.rename(dir, lib_path);
        // console.log("[Webpack bundler] DONE!");
    }
    catch (err) {
        console.log("Something went wrong when building the library", err);
        throw err;
    }
    finally {
        try {
            await cleanup();
        }
        catch (err) { }
    }
}
exports.bundle = bundle;
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
