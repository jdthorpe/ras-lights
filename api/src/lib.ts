import fs from "fs";
import { adminStore } from "./db";
import { reimport, watch } from "./watch";
import { user_library_data, user_library } from "shared/types/admin";

// startup
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

export async function reload_library(name: string) {
    const results = await adminStore.findOne<user_library_data>(
        { type: "LIBRARY", name },
        { _id: 0 }
    );

    if (!results) {
        throw new Error(`no such library ${name}`);
    }

    reimport(results);
}

export async function list_library() {
    return adminStore.find({ type: "LIBRARY" }, { _id: 0 });
}

export async function upsert_library(x: user_library) {
    if (!fs.existsSync(x.path)) {
        console.log(`[LIB/POST] no such library: ${x.path}`);
        throw new Error(`no such library ${x.path}`);
    }

    console.log(`[LIB/POST] upserting ${x.name} @ ${x.path}`);
    const lib: user_library_data = { type: "LIBRARY", ...x };
    adminStore.update({ type: "LIBRARY", name: x.name }, lib, { upsert: true });

    console.log("[LIB/POST] watching...");
    watch(x);
    console.log("[LIB/POST] DONE");
}

export async function remove_library(name: string) {
    console.log(`removing library: ${name}`);
    adminStore.remove({ name }, { multi: true });
    console.log("done");
}
