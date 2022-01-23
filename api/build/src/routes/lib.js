"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Library management routes */
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const ajv_1 = __importDefault(require("ajv"));
const db_1 = require("../db");
const watch_1 = require("../watch");
// startup
(async () => {
    const libs = await db_1.adminStore.find({ type: "LIBRARY" }, { _id: 0 });
    for (let lib of libs) {
        console.log(`[STARTUP] importing library ${lib}`);
        (0, watch_1.reimport)(lib);
    }
})();
const router = (0, express_1.Router)();
exports.default = router;
const ajv = new ajv_1.default();
const schema = {
    type: "object",
    properties: {
        type: { const: "LIBRARY" },
        // use: { type: "boolean" },
        // watch: { type: "boolean" },
        path: { type: "string" },
        name: { type: "string" },
    },
};
// list all
router.get("/", async (req, res) => {
    const results = await db_1.adminStore.find({ type: "LIBRARY" }, { _id: 0 });
    res.status(200);
    res.json(results);
});
// CREATE + UPDATE (upsert)
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        const body = req.body;
        console.log("[LIB/POST] validation");
        if (!ajv.validate(schema, body)) {
            res.status(500);
            res.send(`invalid json payload`);
            return;
        }
        console.log("[LIB/POST] exists??");
        if (!fs_1.default.existsSync(body.path)) {
            res.status(500);
            res.send(`no such library ${body.path}`);
            return;
        }
        console.log("[LIB/POST] upserting");
        db_1.adminStore.update({ type: "LIBRARY", name: body.name }, body, {
            upsert: true,
        });
        // if (body.watch) watch(body);
        // else unwatch(body);
        console.log("[LIB/POST] watching...");
        (0, watch_1.watch)(body);
        console.log("[LIB/POST] DONE");
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
    console.log(`removing ${req.params.name} ???`);
    db_1.adminStore.remove({ name: req.params.name }, { multi: true });
    // TODO: uncache the library members (this requires a restart for now)
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
// import
router.get("/reload/:library", async (req, res) => {
    const start = perf_hooks_1.performance.now();
    const results = await db_1.adminStore.findOne({ type: "LIBRARY", name: req.params.library }, { _id: 0 });
    if (!results) {
        res.status(500);
        res.send(`no such library ${req.params.library}`);
    }
    (0, watch_1.reimport)(results);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
