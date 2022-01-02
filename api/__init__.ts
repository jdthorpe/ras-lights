// initialize the modes database
// usage:
// cd api
// sudo node api/build/__init__.js

import { modeStore } from "./src/db";
import modes from "./default-modes.json";

(async () => {
    const count = await modeStore.count({});
    if (count) {
        console.log(`There aer aleady ${count} modes`);
    } else {
        for (let show of modes) {
            console.log(`Creating mode ${show.name}`);
            await modeStore.update({ name: show.name }, show, { upsert: true });
        }
    }
})();
