/* User Settings routes */
import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import { adminStore } from "../db";
import Ajv from "ajv";

const ajv = new Ajv();

const router = Router();
export default router;

const schemata: { [x: string]: any } = {
    GENERAL_SETTINGS: {
        type: "object",
        properties: {
            delay_ms: { type: "number" },
            series: { type: "boolean" },
            leds: { type: "boolean" },
            tabs: {
                type: "object",
                required: ["phone", "tablet", "computer"],
                patternProperties: {
                    "phone|tablet|computer": {
                        type: "object",
                        patternProperties: {
                            "manual|modes|editor|schedule|template|admin": {
                                type: "boolean",
                            },
                        },
                        required: [
                            "manual",
                            "modes",
                            "editor",
                            "schedule",
                            "template",
                            "admin",
                        ],
                    },
                },
            },
        },
        required: ["delay_ms", "series", "tabs"],
        additionalProperties: false,
    },
};

router.get("/:type", async (req: Request, res: Response) => {
    if (!(req.params.type in schemata)) {
        res.status(500);
        return res.send(`invalid type attribute "${req.params.type}"`);
    }

    const results = await adminStore.findOne(
        { type: req.params.type },
        { _id: 0, type: 0 }
    );

    console.log(`found settings of type "${req.params.type}":`, results);

    res.status(200);
    res.json(results);
});

// CREATE + UPDATE (upsert)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    try {
        const body: { type: string } = req.body;

        if (!(body.type in schemata)) {
            res.status(500);
            return res.send(`invalid type attribute "${body.type}"`);
        }

        if (!ajv.validate(schemata[body.type], body)) {
            res.status(500);
            return res.send(`invalid json payload`);
        }

        adminStore.update({ type: body.type }, body, { upsert: true });
    } catch (err) {
        return next(err);
    }

    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
