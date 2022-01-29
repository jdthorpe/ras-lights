/* Library management routes */
import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import Ajv from "ajv";
import { adminStore } from "../db";
import { user_library_data, ISTRIP_TYPE } from "shared/types/admin";

const router = Router();
export default router;

// TODO: move to shared
const STRIP_TYPE: ISTRIP_TYPE[] = [
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

const ajv = new Ajv();
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
                        count: { type: "number", min: 0 },
                        brightness: { type: "number", min: 0, max: 255 },
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

router.get("/", async (req: Request, res: Response) => {
    const results = await adminStore.findOne({ type: "DRIVER" }, { _id: 0 });
    res.status(200);
    res.json(results);
});

// CREATE + UPDATE (upsert)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    try {
        const body: user_library_data = req.body;

        console.log("[DRIVER/POST] validation");
        if (!ajv.validate(schema, body)) {
            res.status(500);
            res.send(`invalid json payload`);
            return;
        }

        console.log("[DRIVER/POST] upserting");
        adminStore.update({ type: "DRIVER" }, body, {
            upsert: true,
        });

        console.log("[DRIVER/POST] DONE");
    } catch (err) {
        return next(err);
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
