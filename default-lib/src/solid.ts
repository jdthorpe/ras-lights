import { register } from "../../register";
import { rgb } from "../../types";

interface input {
    a: rgb;
}

function solid(x: input): rgb[] {
    return [x.a];
}

register({
    name: "Solid",
    func: solid,
    input: [
        {
            key: "a",
            type: "rgb",
            label: "Color",
            default: [0, 255, 0],
        },
    ],
    output: "rgb[]",
});
