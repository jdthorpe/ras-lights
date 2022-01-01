import { performance } from "perf_hooks";
import { Router, Request, Response } from "express";
import Datastore from "nedb-promises";

/*
curl http://192.168.4.64/api/schedule/ 

curl -X POST http://192.168.4.64/api/schedule/ \
   -H 'Content-Type: application/json' \
   -d '{"name":"My Schedule","mode":"Rainbow Stripes","schedule":"30 8 * * 1-2,4-5"}' 

*/
const datastore = Datastore.create("/var/lib/ras-lights/schedule.db");

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const results = await datastore.find({}, { _id: 0 });
    res.status(200);
    res.json(results);
});

router.post("/", (req: Request, res: Response) => {
    const body = req.body;
    console.log(`schedule body: ${JSON.stringify(body)}`);
    const start = performance.now();
    try {
        datastore.update({ name: body.name }, body, { upsert: true });
    } catch (error) {
        res.status(500);
        res.send(`Failed to create a new schedule:\n${(error as any).message}`);
        return;
    }
    const end = performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});

router.delete("/", (req: Request, res: Response) => {
    const body = req.body;
    console.log(`delete request body: ${JSON.stringify(body)}`);
    // const start = performance.now();
    // try {
    //     datastore.update({ name: body.name }, body, { upsert: true });
    // } catch (error) {
    //     res.status(500);
    //     res.send(`Failed to create a new schedule:\n${(error as any).message}`);
    //     return;
    // }
    // const end = performance.now();
    res.status(200);
    // res.send(`OK ${end - start}`);
});

export default router;
