"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_convert_1 = require("color-convert");
const index_1 = require("../index");
function rainbow_stripes(inputs, globals) {
    const { n } = inputs;
    const out = [];
    for (let i = 0; i < globals.leds; i++)
        out.push(color_convert_1.hsv.rgb([(360 * Math.floor((i * n) / globals.leds)) / n, 100, 100]));
    return out;
}
(0, index_1.register)("Rainbow Stripes", rainbow_stripes, [
    {
        key: "n",
        type: "integer",
        label: "Colors (count)",
        default: 6,
        min: 1,
        max: 100,
    },
], "rgb[]");