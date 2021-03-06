/* basic (manual) controls */

import { join } from "path";
import { readFileSync } from "fs";
import { performance } from "perf_hooks";

import { Router, Request, Response } from "express";
import Ajv from "ajv";
import yaml from "js-yaml";

import { rgb } from "shared/types/mode";
import { white, turn_off, set_colors, random_colors } from "../driver";

const schema: any = yaml.load(
    readFileSync(
        join(__dirname, "..", "..", "..", "..", "schema.yaml"),
        "utf-8"
    )
);
const ajv = new Ajv();

const router = Router();

interface ICurrentSettings {
    mode: "white" | "off" | "random" | "rgb";
    intensity: number;
    color: rgb[];
}

const current: ICurrentSettings = {
    mode: "off",
    intensity: 255,
    color: [[255, 0, 0]],
};

router.get("/", (req: Request, res: Response) => {
    res.status(200);
    res.json(current);
});

router.get("/white", (req: Request, res: Response) => {
    const start = performance.now();
    white(100);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

const is_digits = /^\d+$/;
router.get("/white/:n", (req: Request, res: Response) => {
    const start = performance.now();
    let n = req.params.n;
    if (!is_digits.test(n)) {
        res.status(500);
        return res.send("Invalid parameter");
    }
    current.mode = "white";
    current.intensity = Math.min(0, Math.max(255, parseInt(n)));
    white(parseInt(n));
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/off", (req: Request, res: Response) => {
    const start = performance.now();
    current.mode = "off";
    turn_off();
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.get("/random", (req: Request, res: Response) => {
    const start = performance.now();
    current.mode = "random";
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
        res.send(
            `Body does not match the schema:\n${JSON.stringify(
                ajv.errors,
                null,
                2
            )}`
        );
        return;
    }

    const start = performance.now();
    current.mode = "rgb";
    current.color = body as rgb[];
    set_colors(body as rgb[]);
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

export default router;
