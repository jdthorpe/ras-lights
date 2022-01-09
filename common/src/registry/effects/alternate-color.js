"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
function average(a, b, w) {
    return [
        Math.floor(a[0] * w + b[0] * (1 - w)),
        Math.floor(a[1] * w + b[1] * (1 - w)),
        Math.floor(a[2] * w + b[2] * (1 - w)),
    ];
}
function alternate(x) {
    if (typeof this.starttime === "undefined" ||
        typeof this.cycletime === "undefined") {
        this.starttime = +new Date();
        this.cycletime = 2 * (x.fade + x.hold);
    }
    const offset = (+new Date() - this.starttime) % this.cycletime;
    if (offset < x.hold) {
        return x.a;
    }
    if (offset < x.hold + x.fade) {
        return average(x.b, x.a, (offset - x.hold) / x.fade);
    }
    if (offset < 2 * x.hold + x.fade) {
        return x.b;
    }
    return average(x.a, x.b, (offset - (2 * x.hold + x.fade)) / x.fade);
}
(0, registry_1.register)("Alternate", alternate, [
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
    {
        key: "fade",
        type: "number",
        label: "Fade Time (ms)",
        default: 1000,
        min: 1,
        max: 3600000,
    },
    {
        key: "hold",
        type: "number",
        label: "Hold Time (ms)",
        default: 1000,
        min: 1,
        max: 3600000,
    },
], "rgb");
