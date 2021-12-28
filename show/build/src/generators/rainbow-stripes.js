"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_convert_1 = require("color-convert");
const registry_1 = require("../registry");
const settings_1 = __importDefault(require("../settings"));
function rainbow_stripes(inputs) {
    const { n } = inputs;
    const out = [];
    for (let i = 0; i < settings_1.default.ws281x.leds; i++)
        out.push(color_convert_1.hsv.rgb([
            (360 * Math.floor((i * n) / settings_1.default.ws281x.leds)) / n,
            100,
            100,
        ]));
    return out;
}
(0, registry_1.register)("Rainbow Stripes", rainbow_stripes, [
    {
        key: "n",
        type: "integer",
        label: "Colors (count)",
        default: 6,
        min: 1,
        max: 100,
    },
], "rgb[]");
