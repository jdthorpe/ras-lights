import { performance } from "perf_hooks";

import { Router, Request, Response } from "express";
import { setMode } from "../mode";
import settings from "../settings";
import { build_node } from "@ras-lights/common";
import { modeStore } from "../db";
import { show } from "@ras-lights/common/types/mode";

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
    let mode;
    try {
        mode = build_node(body, { leds: settings.ws281x.leds });
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(`failed to save a mode function:\n${(error as any).message}`);
        return;
    }

    const start = performance.now();
    await setMode(mode);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

// Save a new mode
router.put("/", async (req: Request, res: Response) => {
    const body: show = req.body;

    console.log(`Creating mode ${body.name}`, body);
    const start = performance.now();
    await modeStore.update({ name: body.name }, body, { upsert: true });
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/", async (req: Request, res: Response) => {
    const results = await modeStore.find({}, { _id: 0 });
    res.json(results);
});

export default router;
