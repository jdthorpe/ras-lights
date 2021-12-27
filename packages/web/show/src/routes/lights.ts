import { join } from "path";
import { readFileSync } from "fs";
import { performance } from "perf_hooks";

import { Router, Request, Response } from "express";
import Ajv from "ajv";
import yaml from "js-yaml";

import { turn_off, set_colors, random_colors, rgb } from "../ws681x";

const schema: any = yaml.load(
    readFileSync(join(__dirname, "..", "..", "..", "config.ini"), "utf-8")
);
const ajv = new Ajv();

const router = Router();

router.get("/off", (req: Request, res: Response) => {
    const start = performance.now();
    turn_off();
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/random", (req: Request, res: Response) => {
    const start = performance.now();
    random_colors();
    const end = performance.now();
    console.log("Got body:", req.body);
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.post("/set-colors", (req: Request, res: Response) => {
    const body = req.body;
    if (!ajv.validate(schema, body)) {
        res.status(400);
        res.send(`Body does not match the schema:\n${ajv.errors}`);
        return;
    }

    const start = performance.now();
    set_colors(body as rgb[]);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

export default router;
