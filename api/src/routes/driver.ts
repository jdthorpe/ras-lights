/* Library management routes */
import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import { adminStore } from "../db";
import { user_library_data } from "shared/types/admin";
import { StripType } from "rpi-ws281x-led";

const router = Router();
export default router;

// TODO: move to shared
const PINS = [
    [12, 18, 40, 52],
    [13, 19, 41, 45, 53],
    [21, 31],
    [10, 38],
];

// TODO: move to shared
const STRIP_TYPE: (keyof typeof StripType)[] = [
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

const channelSchema = (pins: number[]) => ({
    type: "object",
    properties: {
        type: { anyOf: STRIP_TYPE.map((s) => ({ const: s })) },
        count: { type: "number", minimum: 0 },
        brightness: { type: "number", minimum: 0, maximum: 255 },
        invert: { type: "boolean" },
        gpio: { anyOf: pins.map((p) => ({ const: p })) },
    },
});

const ajv = new Ajv();
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

router.get("/", async (req: Request, res: Response) => {
    const results = await adminStore.findOne(
        { type: "DRIVER" },
        { _id: 0, type: 0 }
    );
    console.log("found driver:", results);
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
        adminStore.update(
            { type: "DRIVER" },
            { ...body, type: "DRIVER" },
            { upsert: true }
        );

        console.log("[DRIVER/POST] DONE");
    } catch (err) {
        return next(err);
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
