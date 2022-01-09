import { Router, Request, Response } from "express";
import "@ras-lights/common/src/registry"; // side effects (bad)
import { get_descriptors } from "@ras-lights/common/src/registry";

const router = Router();

router.get("/descriptors", (req: Request, res: Response) => {
    res.json(get_descriptors());
});

export default router;
