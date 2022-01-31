"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Library management routes */
const perf_hooks_1 = require("perf_hooks");
const driver_1 = require("../driver");
const express_1 = require("express");
const ajv_1 = __importDefault(require("ajv"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
exports.default = router;
// TODO: move to shared
const PINS = [
    [12, 18, 40, 52],
    [13, 19, 41, 45, 53],
    [21, 31],
    [10, 38],
];
// TODO: move to shared
const STRIP_TYPE = [
    "WS2811_STRIP_RGB",
    "WS2811_STRIP_RBG",
    "WS2811_STRIP_GBR",
    "WS2811_STRIP_GRB",
    "WS2811_STRIP_BRG",
    "WS2811_STRIP_BGR",
    "SK6812_STRIP_RGBW",
    "SK6812_STRIP_RBGW",
    "SK6812_STRIP_GBRW",
    "SK6812_STRIP_GRBW",
    "SK6812_STRIP_BRGW",
    "SK6812_STRIP_BGRW",
];
const channelSchema = (pins) => ({
    type: "object",
    properties: {
        type: { anyOf: STRIP_TYPE.map((s) => ({ const: s })) },
        count: { type: "number", minimum: 0 },
        brightness: { type: "number", minimum: 0, maximum: 255 },
        invert: { type: "boolean" },
        gpio: { anyOf: pins.map((p) => ({ const: p })) },
    },
});
const ajv = new ajv_1.default();
const schema = {
    type: "object",
    properties: {
        type: { const: "DRIVER" },
        frequency: { type: "number" },
        dma: { type: "number", minimum: 0 },
        channels: {
            type: "array",
            items: PINS.map((p) => channelSchema(p)),
        },
    },
};
router.get("/", async (req, res) => {
    const results = await db_1.adminStore.findOne({ type: "DRIVER" }, { _id: 0, type: 0 });
    console.log("found driver:", results);
    res.status(200);
    res.json(results);
});
// CREATE + UPDATE (upsert)
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        const body = req.body;
        console.log("[DRIVER/POST] validation");
        if (!ajv.validate(schema, body)) {
            res.status(500);
            res.send(`invalid json payload`);
            return;
        }
        console.log("[DRIVER/POST] upserting");
        db_1.adminStore.update({ type: "DRIVER" }, { ...body, type: "DRIVER" }, { upsert: true });
        console.log("[DRIVER/POST] reloading driver");
        (0, driver_1.reload_driver)();
        console.log("[DRIVER/POST] DONE");
    }
    catch (err) {
        return next(err);
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
