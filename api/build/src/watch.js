"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reimport = exports.watch = exports.unwatch = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const registry_1 = require("shared/src/registry");
const bundle_1 = require("./bundle");
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
async function reimport(lib) {
    try {
        // try bundling the library (error out if failed)
        await (0, bundle_1.bundle)(lib);
    }
    catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle the library";
    }
    try {
        (0, registry_1.setActiveLibrary)(lib.name);
        require(lib.path);
        (0, registry_1.setActiveLibrary)();
    }
    catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle import library";
    }
}
exports.reimport = reimport;
