"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/:key/:value", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        console.log("params:", JSON.stringify(req.params));
    }
    catch (err) {
        next(err);
        return;
    }
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
exports.default = router;
