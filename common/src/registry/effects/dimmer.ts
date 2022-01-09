import { register } from "../registry";
import { rgb } from "../../../types/mode";

interface input {
    main: rgb[];
    intensity: number;
}

function effect(x: input): rgb[] {
    return x.main.map((color: rgb) => [
        color[0] * x.intensity,
        color[1] * x.intensity,
        color[2] * x.intensity,
    ]);
}

register(
    "Dimmer",
    effect,
    [
        {
            key: "main",
            type: "rgb[]",
            label: "Main",
            default: [
                [0, 0, 255],
                [0, 255, 255],
                [100, 0, 255],
            ],
        },
        {
            key: "intensity",
            type: "number",
            label: "intensity",
            default: 90,
            min: 0,
            max: 0,
        },
    ],
    "rgb[]"
);
