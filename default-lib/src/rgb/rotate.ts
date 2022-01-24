import { register } from "../index";
import { rgb } from "../../types";

interface input {
    in: rgb[];
    period: number;
    backwards: boolean;
}

function rotate(this: { starttime: number }, x: input): rgb[] {
    if (typeof this.starttime === "undefined") this.starttime = +new Date();
    const period = Math.ceil(1000 * x.period);
    let offset: number = Math.floor(
        (x.in.length * ((+new Date() - this.starttime) % period)) / period
    );
    if (x.backwards) offset *= -1;
    return x.in.slice(offset).concat(x.in.slice(0, offset));
}

register({
    name: "Rotate",
    func: rotate,
    input: [
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
    ],
    output: "rgb[]",
});
