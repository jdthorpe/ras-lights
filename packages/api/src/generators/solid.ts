import { register } from "../registry";

type rgb = [number, number, number];

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
        },
    ],
    "rgb[]"
);
