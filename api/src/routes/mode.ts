import { performance } from "perf_hooks";

import { Router, Request, Response, NextFunction } from "express";
import { setMode } from "../mode";
import { modeStore, scheduleStore } from "../db";
import { show } from "shared/types/mode";

const router = Router();

// DELETE
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    const body: { name: string } = req.body;
    const start = performance.now();
    try {
        if (!body.name) throw new Error("missing name");
        if ((await scheduleStore.count({ name: body.name })) > 0)
            throw new Error("Mode is used by an existing schedule");
        modeStore.remove({ name: body.name }, { multi: true });
    } catch (error) {
        next(error);
        return;
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get(
    "/:mode",
    async (req: Request, res: Response, next: NextFunction) => {
        const start = performance.now();
        try {
            await setMode(req.params.mode);
        } catch (err) {
            next(err);
            return;
        }
        const end = performance.now();
        res.status(200);
        res.send(`OK ${end - start}`);
    }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    await setMode(req.body);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

// Save a new mode
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    const body: show = req.body;

    console.log(`Creating mode ${body.name}`, body);
    const start = performance.now();
    try {
        await modeStore.update({ name: body.name }, body, { upsert: true });
    } catch (error) {
        next(error);
        return;
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    let results;
    try {
        results = await modeStore.find({}, { _id: 0 });
    } catch (error) {
        next(error);
        return;
    }
    res.json(results);
});

export default router;
