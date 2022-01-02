// initialize the modes database
// usage:
// cd api
// sudo node api/build/__init__.js

import { modeStore } from "./src/db";
import modes from "./default-modes.json";

(async () => {
    for (let [name, def] of Object.entries(modes)) {
        await modeStore.update({ name }, { name, def }, { upsert: true });
    }
})();
