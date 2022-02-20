"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Library management routes */
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const ajv_1 = __importDefault(require("ajv"));
const watch_1 = require("../watch");
const lib_1 = require("../lib");
// // startup
// (async () => {
//     const libs = await adminStore.find<user_library_data>(
//         { type: "LIBRARY" },
//         { _id: 0 }
//     );
//     for (let lib of libs) {
//         console.log(`[STARTUP] importing library ${JSON.stringify(lib)}`);
//         reimport(lib);
//     }
// })();
const router = (0, express_1.Router)();
exports.default = router;
const ajv = new ajv_1.default();
const schema = {
    type: "object",
    properties: {
        type: { const: "LIBRARY" },
        path: { type: "string" },
        name: { type: "string" },
    },
};
// list all
router.get("/", async (req, res) => {
    const results = await (0, lib_1.list_library)();
    res.status(200);
    res.json(results);
});
// CREATE + UPDATE (upsert)
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        const body = req.body;
        if (!ajv.validate(schema, body)) {
            res.status(500);
            console.log(`[LIB/POST] invalid json payload: ${JSON.stringify(body, null, 2)}`);
            res.send(`invalid json payload`);
            return;
        }
        await (0, lib_1.upsert_library)(body);
        console.log("[LIB/POST] watching...");
        (0, watch_1.watch)(body);
        console.log("[LIB/POST] DONE");
        // console.log("[LIB/POST] exists??");
        // if (!fs.existsSync(body.path)) {
        //     res.status(500);
        //     res.send(`no such library ${body.path}`);
        //     return;
        // }
        // if (body.name === "default") {
        //     res.status(500);
        //     res.send(`Invalid library name`);
        //     return;
        // }
        // console.log("[LIB/POST] upserting");
        // adminStore.update({ type: "LIBRARY", name: body.name }, body, {
        //     upsert: true,
        // });
        // // if (body.watch) watch(body);
        // // else unwatch(body);
        // console.log("[LIB/POST] watching...");
        // watch(body);
        // console.log("[LIB/POST] DONE");
    }
    catch (err) {
        return next(err);
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
// delete
router.delete("/:library", async (req, res) => {
    const start = perf_hooks_1.performance.now();
    (0, lib_1.remove_library)(req.params.library);
    // console.log(`removing ${req.params.library} ???`);
    // adminStore.remove({ name: req.params.library }, { multi: true });
    // // TODO: uncache the library members (this requires a restart for now)
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
// import
router.get("/reload/:library", async (req, res) => {
    const start = perf_hooks_1.performance.now();
    (0, lib_1.reload_library)(req.params.library);
    // const results = await adminStore.findOne<user_library_data>(
    //     { type: "LIBRARY", name: req.params.library },
    //     { _id: 0 }
    // );
    // if (!results) {
    //     res.status(500);
    //     res.send(`no such library ${req.params.library}`);
    // }
    // reimport(results);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
