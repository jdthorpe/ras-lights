"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* User Settings routes */
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const db_1 = require("../db");
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const router = (0, express_1.Router)();
exports.default = router;
const schemata = {
    GENERAL_SETTINGS: {
        type: "object",
        properties: {
            delay_ms: { type: "number" },
            series: { type: "boolean" },
            leds: { type: "boolean" },
            tabs: {
                type: "object",
                required: ["phone", "tablet", "computer"],
                patternProperties: {
                    "phone|tablet|computer": {
                        type: "object",
                        patternProperties: {
                            "manual|modes|editor|schedule|template|admin": {
                                type: "boolean",
                            },
                        },
                        required: [
                            "manual",
                            "modes",
                            "editor",
                            "schedule",
                            "template",
                            "admin",
                        ],
                    },
                },
            },
        },
        required: ["delay_ms", "series", "tabs"],
        additionalProperties: false,
    },
};
router.get("/:type", async (req, res) => {
    if (!(req.params.type in schemata)) {
        res.status(500);
        return res.send(`invalid type attribute "${req.params.type}"`);
    }
    const results = await db_1.adminStore.findOne({ type: req.params.type }, { _id: 0, type: 0 });
    console.log(`found settings of type "${req.params.type}":`, results);
    res.status(200);
    res.json(results);
});
// CREATE + UPDATE (upsert)
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        const body = req.body;
        if (!(body.type in schemata)) {
            res.status(500);
            return res.send(`invalid type attribute "${body.type}"`);
        }
        if (!ajv.validate(schemata[body.type], body)) {
            res.status(500);
            return res.send(`invalid json payload`);
        }
        db_1.adminStore.update({ type: body.type }, body, { upsert: true });
    }
    catch (err) {
        return next(err);
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
