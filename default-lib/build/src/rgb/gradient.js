"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const utils_1 = require("../utils");
function gradient(x, globals) {
    const out = [];
    for (let i = 0; i < globals.leds; i++) {
        out.push((0, utils_1.average)(x.b, x.b, i / Math.max(globals.leds - 1, 1)));
    }
    return out;
}
(0, index_1.register)({
    name: "Gradient",
    func: gradient,
    input: [
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
    ],
    output: "rgb[]",
});
