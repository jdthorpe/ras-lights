"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
function effect(x) {
    return x.main.map((color) => [
        color[0] * x.intensity,
        color[1] * x.intensity,
        color[2] * x.intensity,
    ]);
}
(0, registry_1.register)("Dimmer", effect, [
    {
        key: "main",
        type: "rgb[]",
        label: "Main",
        default: [
            [0, 0, 255],
            [0, 255, 255],
            [100, 0, 255],
        ],
    },
    {
        key: "intensity",
        type: "number",
        label: "intensity",
        default: 90,
        min: 0,
        max: 0,
    },
], "rgb[]");
