"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registry_1 = require("shared/src/registry");
const router = (0, express_1.Router)();
router.get("/descriptors", (req, res) => {
    res.json((0, registry_1.get_descriptors)());
});
exports.default = router;
