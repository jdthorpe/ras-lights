import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import { set_updates, get_updates } from "../mode";
import { get_mode } from "./mode";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    /* inject parameters into the running show (mode) */
    const start = performance.now();
    try {
        set_updates(req.body);
    } catch (err) {
        next(err);
        return;
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/", async (req: Request, res: Response) => {
    /* get the injected parameters  */
    res.status(200);
    res.json({ mode: get_mode(), updates: get_updates() });
});

export default router;
