/* Library management routes */
import { performance } from "perf_hooks";
import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import Ajv from "ajv";
import { adminStore } from "../db";
import { reimport, watch, unwatch } from "../watch";
import { user_library_data } from "shared/types/admin";

// startup
(async () => {
    const libs = await adminStore.find<user_library_data>(
        { type: "LIBRARY" },
        { _id: 0 }
    );
    for (let lib of libs) {
        console.log(`[STARTUP] importing library ${JSON.stringify(lib)}`);
        reimport(lib);
    }
})();

const router = Router();
export default router;

const ajv = new Ajv();
const schema = {
    type: "object",
    properties: {
        type: { const: "LIBRARY" },
        path: { type: "string" },
        name: { type: "string" },
    },
};

// list all
router.get("/", async (req: Request, res: Response) => {
    const results = await adminStore.find({ type: "LIBRARY" }, { _id: 0 });
    res.status(200);
    res.json(results);
});

// CREATE + UPDATE (upsert)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    try {
        const body: user_library_data = req.body;

        console.log("[LIB/POST] validation");
        if (!ajv.validate(schema, body)) {
            res.status(500);
            res.send(`invalid json payload`);
            return;
        }

        console.log("[LIB/POST] exists??");
        if (!fs.existsSync(body.path)) {
            res.status(500);
            res.send(`no such library ${body.path}`);
            return;
        }
        if (body.name === "default") {
            res.status(500);
            res.send(`Invalid library name`);
            return;
        }

        console.log("[LIB/POST] upserting");
        adminStore.update({ type: "LIBRARY", name: body.name }, body, {
            upsert: true,
        });

        // if (body.watch) watch(body);
        // else unwatch(body);

        console.log("[LIB/POST] watching...");
        watch(body);
        console.log("[LIB/POST] DONE");
    } catch (err) {
        return next(err);
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

// delete
router.delete("/:library", async (req: Request, res: Response) => {
    const start = performance.now();

    console.log(`removing ${req.params.library} ???`);
    adminStore.remove({ name: req.params.library }, { multi: true });

    // TODO: uncache the library members (this requires a restart for now)

    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

// import
router.get("/reload/:library", async (req: Request, res: Response) => {
    const start = performance.now();

    const results = await adminStore.findOne<user_library_data>(
        { type: "LIBRARY", name: req.params.library },
        { _id: 0 }
    );

    if (!results) {
        res.status(500);
        res.send(`no such library ${req.params.library}`);
    }

    reimport(results);

    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
