"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const mode_1 = require("../mode");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// DELETE
router.delete("/", async (req, res, next) => {
    const body = req.body;
    const start = perf_hooks_1.performance.now();
    try {
        if (!body.name)
            throw new Error("missing name");
        if ((await db_1.scheduleStore.count({ name: body.name })) > 0)
            throw new Error("Mode is used by an existing schedule");
        db_1.modeStore.remove({ name: body.name }, { multi: true });
    }
    catch (error) {
        next(error);
        return;
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.get("/:mode", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        await (0, mode_1.setMode)(req.params.mode);
    }
    catch (err) {
        next(err);
        return;
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    await (0, mode_1.setMode)(req.body);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
// Save a new mode
router.put("/", async (req, res, next) => {
    const body = req.body;
    console.log(`Creating mode ${body.name}`, body);
    const start = perf_hooks_1.performance.now();
    try {
        await db_1.modeStore.update({ name: body.name }, body, { upsert: true });
    }
    catch (error) {
        next(error);
        return;
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.get("/", async (req, res, next) => {
    let results;
    try {
        results = await db_1.modeStore.find({}, { _id: 0 });
    }
    catch (error) {
        next(error);
        return;
    }
    res.json(results);
});
exports.default = router;
