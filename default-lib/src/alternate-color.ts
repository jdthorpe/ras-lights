import { register } from "../../register";
import { average } from "../utils";

interface input {
    a: rgb;
    b: rgb;
    fade: number;
    hold: number;
}

function alternate(
    this: { start_time: number; cycle_time: number },
    x: input
): rgb {
    if (
        typeof this.start_time === "undefined" ||
        typeof this.cycle_time === "undefined"
    ) {
        this.start_time = +new Date();
        this.cycle_time = 2 * (x.fade + x.hold);
    }

    const offset: number = (+new Date() - this.start_time) % this.cycle_time;

    if (offset < x.hold) {
        return x.b;
    }
    if (offset < x.hold + x.fade) {
        return average(x.b, x.a, (offset - x.hold) / x.fade);
    }
    if (offset < 2 * x.hold + x.fade) {
        return x.a;
    }
    return average(x.a, x.b, (offset - (2 * x.hold + x.fade)) / x.fade);
}

register({
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
