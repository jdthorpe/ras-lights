"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const nedb_promises_1 = __importDefault(require("nedb-promises"));
/*
curl http://192.168.4.64/api/schedule/

curl -X POST http://192.168.4.64/api/schedule/ \
   -H 'Content-Type: application/json' \
   -d '{"name":"My Schedule","mode":"Rainbow Stripes","schedule":"30 8 * * 1-2,4-5"}'

*/
const datastore = nedb_promises_1.default.create("/var/lib/ras-lights/schedule.db");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const results = await datastore.find({}, { _id: 0 });
    res.status(200);
    res.json(results);
});
router.post("/", (req, res) => {
    const body = req.body;
    console.log(`schedule body: ${JSON.stringify(body)}`);
    const start = perf_hooks_1.performance.now();
    try {
        datastore.update({ name: body.name }, body, { upsert: true });
    }
    catch (error) {
        res.status(500);
        res.send(`Failed to create a new schedule:\n${error.message}`);
        return;
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.delete("/", (req, res) => {
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
exports.default = router;
