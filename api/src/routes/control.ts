import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import { set_updates } from "../mode";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    try {
        console.log("body:", JSON.stringify(req.body));
        set_updates(req.body);
    } catch (err) {
        next(err);
        return;
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

export default router;
