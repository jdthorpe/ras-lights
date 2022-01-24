import { register } from "../index";
import { rgb, globals } from "../../types";
import { average } from "../utils";

interface input {
    a: rgb;
    b: rgb;
}

function gradient(x: input, globals: globals): rgb[] {
    const out: rgb[] = [];
    for (let i = 0; i < globals.leds; i++) {
        out.push(average(x.a, x.b, i / Math.max(globals.leds - 1, 1)));
    }
    return out;
}

register({
    name: "Gradient",
    func: gradient,
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
    ],
    output: "rgb[]",
});
