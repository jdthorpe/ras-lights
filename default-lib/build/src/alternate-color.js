"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../register");
const utils_1 = require("./utils");
function alternate(x) {
    if (typeof this.start_time === "undefined" ||
        typeof this.cycle_time === "undefined") {
        this.start_time = +new Date();
        this.cycle_time = 2 * (x.fade + x.hold);
    }
    const offset = (+new Date() - this.start_time) % this.cycle_time;
    if (offset < x.hold) {
        return x.b;
    }
    if (offset < x.hold + x.fade) {
        return (0, utils_1.average)(x.b, x.a, (offset - x.hold) / x.fade);
    }
    if (offset < 2 * x.hold + x.fade) {
        return x.a;
    }
    return (0, utils_1.average)(x.a, x.b, (offset - (2 * x.hold + x.fade)) / x.fade);
}
(0, register_1.register)({
    name: "Alternate",
    func: alternate,
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
    ],
    output: "rgb",
});
