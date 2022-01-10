import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get(
    "/:key/:value",
    async (req: Request, res: Response, next: NextFunction) => {
        const start = performance.now();
        try {
            console.log("params:", JSON.stringify(req.params));
        } catch (err) {
            next(err);
            return;
        }
        const end = performance.now();
        res.status(200);
        res.send(`OK ${end - start}`);
    }
);

export default router;
