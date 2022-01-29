"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Library management routes */
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const ajv_1 = __importDefault(require("ajv"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
exports.default = router;
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
const ajv = new ajv_1.default();
const schema = {
    type: "object",
    properties: {
        type: { const: "DRIVER" },
        frequency: { type: "number" },
        channels: {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        type: {
                            anyOf: STRIP_TYPE.map((s) => ({ const: s })),
                        },
                        count: { type: "number", minimum: 0 },
                        brightness: {
                            type: "number",
                            minimum: 0,
                            maximum: 255,
                        },
                        gpio: {
                            anyOf: [
                                { const: 12 },
                                { const: 18 },
                                { const: 40 },
                                { const: 52 },
                            ],
                        },
                    },
                },
                {
                    type: "object",
                    properties: {
                        type: {
                            anyOf: STRIP_TYPE.map((s) => ({ const: s })),
                        },
                        count: { type: "number", minimum: 0 },
                        brightness: {
                            type: "number",
                            minimum: 0,
                            maximum: 255,
                        },
                        gpio: {
                            anyOf: [
                                { const: 13 },
                                { const: 19 },
                                { const: 41 },
                                { const: 55 },
                                { const: 53 },
                            ],
                        },
                    },
                },
            ],
        },
    },
};
router.get("/", async (req, res) => {
    const results = await db_1.adminStore.findOne({ type: "DRIVER" }, { _id: 0 });
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
        db_1.adminStore.update({ type: "DRIVER" }, body, {
            upsert: true,
        });
        console.log("[DRIVER/POST] DONE");
    }
    catch (err) {
        return next(err);
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
