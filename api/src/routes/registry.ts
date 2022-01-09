import { Router, Request, Response } from "express";
import "@ras-lights/common/src/registry";
import { get_descriptors } from "@ras-lights/common/src/registry/registry";

const router = Router();

router.get("/descriptors", (req: Request, res: Response) => {
    res.json(get_descriptors());
});

export default router;
