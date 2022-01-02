import { performance } from "perf_hooks";
import { Router, Request, Response } from "express";
import { scheduleStore } from "../db";

/*

curl -X POST http://192.168.4.64/api/schedule/ \
   -H 'Content-Type: application/json' \
   -d '{"name":"My Schedule","mode":"Rainbow Stripes","schedule":"30 8 * * 1-2,4-5"}' 

curl http://192.168.4.64/api/schedule/ 

curl -X DELETE http://192.168.4.64/api/schedule/ \
   -H 'Content-Type: application/json' \
   -d '{"name":"My Schedule"}' 

curl http://192.168.4.64/api/schedule/ 

*/

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const results = await scheduleStore.find({}, { _id: 0 });
    res.status(200);
    res.json(results);
});

router.post("/", (req: Request, res: Response) => {
    const body = req.body;
    console.log(`schedule body: ${JSON.stringify(body)}`);
    const start = performance.now();
    scheduleStore.update({ name: body.name }, body, { upsert: true });
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.delete("/", (req: Request, res: Response) => {
    const body = req.body;
    const start = performance.now();
    if (!body.name) throw new Error("missing name");
    scheduleStore.remove({ name: body.name }, { multi: true });
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

export default router;
