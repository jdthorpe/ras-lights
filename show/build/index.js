"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
const mode_1 = require("./src/mode");
const axios_1 = __importDefault(require("axios"));
const settings_1 = __importDefault(require("./src/settings"));
const s_modes = js_yaml_1.default.load((0, fs_1.readFileSync)("./modes.yaml", "utf-8"));
// console.log(JSON.stringify(s_modes, null, 4));
// @ts-ignore
const mode = (0, mode_1.create_mode)(s_modes[0], "rgb[]");
const root = `http://${settings_1.default.show.controller_host}`;
console.log(root);
// (async () => {
//     console.log("hi");
//     await axios.get(root + "/lights/off");
//     process.exit();
// })();
let running = true;
let go = true;
setTimeout(async () => {
    go = false;
    await axios_1.default.get(root + "/lights/off");
    while (running) { }
    process.exit();
}, 50000);
(async () => {
    let end;
    let start = +new Date();
    while (go) {
        const m = mode();
        // console.log(JSON.stringify([m[0], m[m.length - 1]]));
        // console.log(JSON.stringify(m));
        await Promise.all([
            // new Promise((resolve, reject) => setTimeout(() => resolve(1), 30)),
            axios_1.default.post(`http://${settings_1.default.show.controller_host}:${settings_1.default.controller.port}/set-colors`, m, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        ]);
        end = +new Date();
        console.log(`ellapsed: ${end - start}`);
        start = end;
    }
    running = false;
})();
