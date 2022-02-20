import { adminStore } from "./db";
import { user_library_data } from "shared/types/admin";
import { reload } from "./cron";
import { reimport } from "./watch";

(async () => {
    const libs = await adminStore.find<user_library_data>(
        { type: "LIBRARY" },
        { _id: 0 }
    );
    for (let lib of libs) {
        console.log(`[STARTUP] importing library ${JSON.stringify(lib)}`);
        reimport(lib);
    }
})();

console.log(`[STARTUP] loading cron jobs`);
reload();
