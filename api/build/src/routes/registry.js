"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
require("@ras-lights/common/src/registry"); // side effects (bad)
const registry_1 = require("@ras-lights/common/src/registry");
const router = (0, express_1.Router)();
router.get("/descriptors", (req, res) => {
    res.json((0, registry_1.get_descriptors)());
});
exports.default = router;
