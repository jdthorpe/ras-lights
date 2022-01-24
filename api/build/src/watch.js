"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reimport = exports.watch = exports.unwatch = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const fs_1 = __importDefault(require("fs"));
const registry_1 = require("shared/src/registry");
const path_1 = __importDefault(require("path"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const watchers = {};
async function unwatch(lib) {
    if (lib.path in watchers) {
        const watcher = watchers[lib.path];
        await watcher.close();
        delete watchers[lib.path];
    }
}
exports.unwatch = unwatch;
function watch(lib) {
    if (lib.path in watchers)
        return;
    const watch = chokidar_1.default
        .watch(path_1.default.normalize(lib.path + "/") + "**/*.js", {
        ignored: /node_modules/,
    })
        .on("change", () => _reimport(lib));
    watchers[lib.path] = watch;
}
exports.watch = watch;
const _reimport = (0, lodash_debounce_1.default)(reimport, 250);
const LIBRARY_DIR = path_1.default.resolve(path_1.default.join(__dirname, "../../../lib"));
async function reimport(lib) {
    const lib_dist = path_1.default.join(LIBRARY_DIR, lib.name);
    const lib_dist_target = path_1.default.resolve(path_1.default.join(lib.path, "dist"));
    if (!fs_1.default.existsSync(lib_dist_target)) {
        console.log(`[reimport] Failed to import, no such directory ${lib_dist_target}`);
        return;
    }
    if (fs_1.default.existsSync(lib_dist)) {
        // the link already exists
        const link = path_1.default.resolve(fs_1.default.readlinkSync(lib_dist));
        if (link !== lib_dist_target) {
            // but it points to the wrong place
            fs_1.default.unlinkSync(lib_dist);
            fs_1.default.symlinkSync(lib_dist_target, lib_dist);
        }
    }
    else {
        fs_1.default.symlinkSync(lib_dist_target, lib_dist);
    }
    console.log(`>>> About to require lib.path: ${lib.path}`);
    try {
        (0, registry_1.setActiveLibrary)(lib.name);
        console.log(`>>> About to require lib.path: ${lib.path}`);
        require(lib.path);
        console.log(`>>> Successfully required lib.path: ${lib.path}`);
        (0, registry_1.setActiveLibrary)();
    }
    catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle import library";
    }
}
exports.reimport = reimport;
