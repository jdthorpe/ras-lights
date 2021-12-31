"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function average(a, b, w) {
    return [
        Math.floor(a[0] * w + b[0] * (1 - w)),
        Math.floor(a[1] * w + b[1] * (1 - w)),
        Math.floor(a[2] * w + b[2] * (1 - w)),
    ];
}
function gradient(x, globals) {
    const out = [];
    for (let i = 0; i < globals.leds; i++) {
        out.push(average(x.a, x.b, i / Math.max(globals.leds - 1, 1)));
    }
    return out;
}
(0, index_1.register)("Gradient", gradient, [
    {
        key: "a",
        type: "rgb",
        label: "First Color",
        default: [255, 0, 0],
    },
    {
        key: "b",
        type: "rgb",
        label: "Second Color",
        default: [0, 0, 255],
    },
], "rgb[]");
