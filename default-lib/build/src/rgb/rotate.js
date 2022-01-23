"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
function rotate(x) {
    if (typeof this.starttime === "undefined")
        this.starttime = +new Date();
    const period = Math.ceil(1000 * x.period);
    let offset = Math.floor((x.in.length * ((+new Date() - this.starttime) % period)) / period);
    if (x.backwards)
        offset *= -1;
    return x.in.slice(offset).concat(x.in.slice(0, offset));
}
(0, __1.register)("Rotate", rotate, [
    {
        key: "in",
        type: "rgb[]",
        label: "Color Array",
        default: [
            [255, 0, 0],
            [255, 255, 0],
            [0, 255, 0],
            [0, 255, 255],
            [0, 0, 255],
            [255, 0, 255],
        ],
    },
    {
        key: "period",
        type: "number",
        label: "Period (s)",
        default: 1,
        min: 1,
        max: 600,
    },
    {
        key: "backwards",
        type: "boolean",
        label: "Reverse Direction",
        default: false,
    },
], "rgb[]");
