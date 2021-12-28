import { performance } from "perf_hooks";

import { Router, Request, Response } from "express";
import { setMode } from "../mode";

import { mode_config } from "../../index";

const router = Router();

router.get("/mode/:mode", (req: Request, res: Response) => {
    const start = performance.now();
    setMode(req.params.mode);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/mode/", (req: Request, res: Response) => {
    res.json(mode_config);
});

export default router;
