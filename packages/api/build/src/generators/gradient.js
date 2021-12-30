"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
const settings_1 = __importDefault(require("../settings"));
function average(a, b, w) {
    return [
        Math.floor(a[0] * w + b[0] * (1 - w)),
        Math.floor(a[1] * w + b[1] * (1 - w)),
        Math.floor(a[2] * w + b[2] * (1 - w)),
    ];
}
function gradient(x) {
    const out = [];
    for (let i = 0; i < settings_1.default.ws281x.leds; i++) {
        out.push(average(x.a, x.b, i / Math.max(settings_1.default.ws281x.leds - 1, 1)));
    }
    return out;
}
(0, registry_1.register)("Gradient", gradient, [
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
