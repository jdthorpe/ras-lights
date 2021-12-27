"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const perf_hooks_1 = require("perf_hooks");
const express_1 = require("express");
const ajv_1 = __importDefault(require("ajv"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const ws681x_1 = require("../ws681x");
const schema = js_yaml_1.default.load((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "..", "..", "..", "..", "config.ini"), "utf-8"));
const ajv = new ajv_1.default();
const router = (0, express_1.Router)();
router.get("/off", (req, res) => {
    const start = perf_hooks_1.performance.now();
    (0, ws681x_1.turn_off)();
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.get("/random", (req, res) => {
    const start = perf_hooks_1.performance.now();
    (0, ws681x_1.random_colors)();
    const end = perf_hooks_1.performance.now();
    console.log("Got body:", req.body);
    res.status(200);
    res.send(`OK ${end - start}`);
});
router.post("/set-colors", (req, res) => {
    const body = req.body;
    if (!ajv.validate(schema, body)) {
        res.status(400);
        res.send(`Body does not match the schema:\n${ajv.errors}`);
        return;
    }
    const start = perf_hooks_1.performance.now();
    (0, ws681x_1.set_colors)(body);
    const end = perf_hooks_1.performance.now();
    res.status(200);
    res.send(`OK ${end - start}`);
});
exports.default = router;
