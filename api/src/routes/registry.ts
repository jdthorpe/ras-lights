import { Router, Request, Response } from "express";
import { get_descriptors } from "shared/src/registry";

const router = Router();

router.get("/descriptors", (req: Request, res: Response) => {
    res.json(get_descriptors());
});

export default router;
