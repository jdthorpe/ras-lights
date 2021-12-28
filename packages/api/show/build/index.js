"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mode_config = void 0;
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
const mode_1 = require("./src/mode");
const path_1 = require("path");
exports.mode_config = js_yaml_1.default.load((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../modes.yaml"), "utf-8"));
// console.log(JSON.stringify(s_modes, null, 4));
for (let [key, value] of Object.entries(exports.mode_config))
    (0, mode_1.create_node)(key, value);
// ----------------------------------------
// start the web app
// ----------------------------------------
require("./app");
// (async () => {
//     console.log("hi");
//     await axios.get(root + "/lights/off");
//     process.exit();
// })();
