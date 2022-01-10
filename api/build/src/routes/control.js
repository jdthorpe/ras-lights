"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const mode_1 = require("../mode");
const router = (0, express_1.Router)();
router.post("/", async (req, res, next) => {
    const start = perf_hooks_1.performance.now();
    try {
        // console.log("body:", JSON.stringify(req.body));
        (0, mode_1.set_updates)(req.body);
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
