"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const mode_1 = require("../mode");
const index_1 = require("../../index");
const router = (0, express_1.Router)();
router.get("/:mode", (req, res) => {
    const start = perf_hooks_1.performance.now();
    (0, mode_1.setMode)(req.params.mode);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.get("/", (req, res) => {
    res.json(index_1.mode_config);
});
exports.default = router;
