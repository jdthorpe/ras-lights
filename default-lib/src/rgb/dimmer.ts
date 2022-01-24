import { register } from "../index";
import { rgb } from "../../types";

interface input {
    main: rgb[];
    intensity: number;
}

function effect(x: input): rgb[] {
    const intensity = Math.max(0, Math.min(x.intensity, 100)) / 100;
    return x.main.map((color: rgb) => [
        Math.floor(color[0] * intensity),
        Math.floor(color[1] * intensity),
        Math.floor(color[2] * intensity),
    ]);
}

register({
    name: "Dimmer",
    func: effect,
    input: [
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
            label: "Brightness",
            default: 90,
            min: 0,
            max: 100,
        },
    ],
    output: "rgb[]",
});
