import { register } from "../";
import { rgb } from "../../../types/mode";

interface input {
    main: rgb[];
    intensity: number;
}

function effect(x: input): rgb[] {
    const intensity = Math.max(0, Math.min(x.intensity, 100));
    return x.main.map((color: rgb) => [
        (color[0] * intensity) / 100,
        (color[1] * intensity) / 100,
        (color[2] * intensity) / 100,
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
