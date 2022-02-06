import { register } from "../register";
import { average } from "./utils";

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
    // convert seconds to milliseconds
    const hold = x.hold * 1000;
    const fade = x.fade * 1000;
    if (
        typeof this.start_time === "undefined" ||
        typeof this.cycle_time === "undefined"
    ) {
        this.start_time = +new Date();
        this.cycle_time = 2 * (fade + hold);
    }

    const offset: number = (+new Date() - this.start_time) % this.cycle_time;

    if (offset < hold) {
        return x.b;
    }
    if (offset < hold + fade) {
        return average(x.b, x.a, (offset - hold) / fade);
    }
    if (offset < 2 * hold + fade) {
        return x.a;
    }
    return average(x.a, x.b, (offset - (2 * hold + fade)) / fade);
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
            label: "Fade Time (seconds)",
            default: 1.5,
            min: 1,
            max: 3600000,
        },
        {
            key: "hold",
            type: "number",
            label: "Hold Time (seconds)",
            default: 1.5,
            min: 1,
            max: 3600000,
        },
    ],
    output: "rgb",
});
