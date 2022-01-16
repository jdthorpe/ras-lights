import { register } from "../";
import { rgb } from "../../../types/mode";

interface input {
    a: rgb;
}

function solid(x: input): rgb[] {
    return [x.a];
}

register(
    "Solid",
    solid,
    [
        {
            key: "a",
            type: "rgb",
            label: "Color",
            default: [0, 255, 0],
        },
    ],
    "rgb[]"
);
