import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import { set_updates } from "../mode";

const router = Router();

const patches: { [key: string]: any } = {};

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    /* inject parameters into the running show (mode) */
    const start = performance.now();
    try {
        // console.log("body:", JSON.stringify(req.body));
        patches[req.body.key] = req.body;
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
    res.json(patches);
});

export default router;
