"use strict";
// initialize the modes database
// usage:
// cd api
// sudo node api/build/__init__.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mode_config = void 0;
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = require("path");
const db_1 = require("./src/db");
exports.mode_config = js_yaml_1.default.load((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../modes.yaml"), "utf-8"));
(async () => {
    for (let [name, def] of Object.entries(exports.mode_config)) {
        await db_1.modeStore.update({ name }, { name, def }, { upsert: true });
    }
})();
