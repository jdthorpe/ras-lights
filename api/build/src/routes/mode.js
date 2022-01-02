"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const mode_1 = require("../mode");
const settings_1 = __importDefault(require("../settings"));
const common_1 = require("@ras-lights/common");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get("/:mode", async (req, res) => {
    const start = perf_hooks_1.performance.now();
    await (0, mode_1.setMode)(req.params.mode);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.post("/", async (req, res) => {
    const body = req.body;
    let mode;
    try {
        mode = (0, common_1.build_node)(body, { leds: settings_1.default.ws281x.leds });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send(`failed to save a mode function:\n${error.message}`);
        return;
    }
    const start = perf_hooks_1.performance.now();
    await (0, mode_1.setMode)(mode);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
// Save a new mode
router.put("/", async (req, res) => {
    const body = req.body;
    console.log(`Creating mode ${body.name}`, body);
    const start = perf_hooks_1.performance.now();
    await db_1.modeStore.update({ name: body.name }, body, { upsert: true });
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.get("/", async (req, res) => {
    const results = await db_1.modeStore.find({}, { _id: 0 });
    res.json(results);
});
exports.default = router;
