import { readFileSync } from "fs";
import yaml from "js-yaml";
import { create_node } from "./src/mode";
import { join } from "path";

// ----------------------------------------
// initialize the modes
// ----------------------------------------
interface mode_data {
    [key: string]: any;
}

const s_modes: mode_data = yaml.load(
    readFileSync(join(__dirname, "../../modes.yaml"), "utf-8")
) as mode_data;
// console.log(JSON.stringify(s_modes, null, 4));

for (let [key, value] of Object.entries(s_modes)) create_node(key, value);

// ----------------------------------------
// start the web app
// ----------------------------------------
import "./app";

// (async () => {
//     console.log("hi");
//     await axios.get(root + "/lights/off");
//     process.exit();
// })();
