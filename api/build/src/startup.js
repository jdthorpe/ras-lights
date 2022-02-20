"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const cron_1 = require("./cron");
const watch_1 = require("./watch");
(async () => {
    const libs = await db_1.adminStore.find({ type: "LIBRARY" }, { _id: 0 });
    for (let lib of libs) {
        console.log(`[STARTUP] importing library ${JSON.stringify(lib)}`);
        (0, watch_1.reimport)(lib);
    }
})();
console.log(`[STARTUP] loading cron jobs`);
(0, cron_1.reload)();
