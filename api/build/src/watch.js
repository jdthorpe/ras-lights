"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const require_directory_1 = __importDefault(require("require-directory"));
const registry_1 = require("shared/src/registry");
function watch(lib) {
    chokidar_1.default.watch(lib.path).on("change", () => reimport(lib));
}
exports.watch = watch;
function reimport(lib) {
    (0, registry_1.setActiveLibrary)(lib.name);
    (0, require_directory_1.default)(module, lib.path);
    (0, registry_1.setActiveLibrary)();
}
