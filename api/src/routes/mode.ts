import { performance } from "perf_hooks";

import { Router, Request, Response } from "express";
import { setMode } from "../mode";
import settings from "../settings";
import { build_node } from "@ras-lights/common";

import { modeStore } from "../db";

const router = Router();

router.get("/:mode", async (req: Request, res: Response) => {
    const start = performance.now();
    await setMode(req.params.mode);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    console.log(`mode body: ${JSON.stringify(body)}`);
    let mode;
    try {
        mode = build_node(body, { leds: settings.ws281x.leds });
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(
            `failed to create a mode function:\n${(error as any).message}`
        );
        return;
    }

    const start = performance.now();
    await setMode(mode);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/", async (req: Request, res: Response) => {
    const results = await modeStore.find({}, { _id: 0 });
    res.json(results);
});

export default router;
