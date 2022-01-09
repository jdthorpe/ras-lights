"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
function effect(x) {
    const intensity = Math.max(0, Math.min(x.intensity, 100)) / 100;
    return x.main.map((color) => [
        Math.floor(color[0] * intensity),
        Math.floor(color[1] * intensity),
        Math.floor(color[2] * intensity),
    ]);
}
(0, __1.register)("Dimmer", effect, [
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
        max: 100,
    },
], "rgb[]");
