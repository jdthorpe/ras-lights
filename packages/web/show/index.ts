import { readFileSync } from "fs";
import yaml from "js-yaml";
import { create_mode } from "./src/mode";
import axios from "axios";
import settings from "./src/settings";

const s_modes = yaml.load(readFileSync("./modes.yaml", "utf-8"));
// console.log(JSON.stringify(s_modes, null, 4));

// @ts-ignore
const mode = create_mode(s_modes[0], "rgb[]");

const root = `http://${settings.show.controller_host}`;
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
    await axios.get(root + "/lights/off");
    while (running) {}
    process.exit();
}, 50000);

(async () => {
    let end: number;
    let start: number = +new Date();
    while (go) {
        const m = mode();
        // console.log(JSON.stringify([m[0], m[m.length - 1]]));
        // console.log(JSON.stringify(m));
        await Promise.all([
            // new Promise((resolve, reject) => setTimeout(() => resolve(1), 30)),
            axios.post(
                `http://${settings.show.controller_host}:${settings.controller.port}/set-colors`,
                m,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ),
        ]);
        end = +new Date();
        console.log(`ellapsed: ${end - start}`);
        start = end;
    }
    running = false;
})();
