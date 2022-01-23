import { register } from "../index";
import { rgb } from "../../types";
import { average } from "../utils";

interface input {
    a: rgb;
    b: rgb;
    fade: number;
    hold: number;
}

function alternate(
    this: { starttime: number; cycletime: number },
    x: input
): rgb {
    if (
        typeof this.starttime === "undefined" ||
        typeof this.cycletime === "undefined"
    ) {
        this.starttime = +new Date();
        this.cycletime = 2 * (x.fade + x.hold);
    }

    const offset: number = (+new Date() - this.starttime) % this.cycletime;

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

register(
    "Alternate",
    alternate,
    [
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
    "rgb"
);
