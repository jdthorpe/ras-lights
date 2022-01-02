"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const db_1 = require("../db");
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
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const results = await db_1.scheduleStore.find({}, { _id: 0 });
    res.status(200);
    res.json(results);
});
router.post("/", (req, res) => {
    const body = req.body;
    console.log(`schedule body: ${JSON.stringify(body)}`);
    const start = perf_hooks_1.performance.now();
    db_1.scheduleStore.update({ name: body.name }, body, { upsert: true });
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.delete("/", (req, res) => {
    const body = req.body;
    const start = perf_hooks_1.performance.now();
    if (!body.name)
        throw new Error("missing name");
    db_1.scheduleStore.remove({ name: body.name }, { multi: true });
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
exports.default = router;
