// initialize the modes database
// usage:
// cd api
// sudo node api/build/__init__.js

import { readFileSync } from "fs";
import yaml from "js-yaml";
import { join } from "path";
import { modeStore } from "./src/db";

export const mode_config: any = yaml.load(
    readFileSync(join(__dirname, "../../modes.yaml"), "utf-8")
);

(async () => {
    for (let [name, def] of Object.entries(mode_config)) {
        await modeStore.update({ name }, { name, def }, { upsert: true });
    }
})();
