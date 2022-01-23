import { register } from "../";
import { globals } from "../../types";
import { rgb } from "../../types";
import { average } from "../utils";

interface input {
    a: rgb;
    b: rgb;
}

function gradient(x: input, globals: globals): rgb[] {
    const out: rgb[] = [];
    for (let i = 0; i < globals.leds; i++) {
        out.push(average(x.b, x.b, i / Math.max(globals.leds - 1, 1)));
    }
    return out;
}

register(
    "Gradient",
    gradient,
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
    ],
    "rgb[]"
);
