"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const mode_1 = require("../mode");
const mode_2 = require("./mode");
const router = (0, express_1.Router)();
router.post("/", async (req, res, next) => {
    /* inject parameters into the running show (mode) */
    const start = perf_hooks_1.performance.now();
    try {
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
router.get("/", async (req, res) => {
    /* get the injected parameters  */
    res.status(200);
    res.json({ mode: (0, mode_2.get_mode)(), updates: (0, mode_1.get_updates)() });
});
exports.default = router;
