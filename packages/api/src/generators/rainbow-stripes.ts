import { hsv } from "color-convert";

import { register } from "../registry";
import settings from "../settings";

interface input {
    n: number;
}

type rgb = [number, number, number];

function rainbow_stripes(inputs: input): rgb[] {
    const { n } = inputs;
    const out: rgb[] = [];
    for (let i = 0; i < settings.ws281x.leds; i++)
        out.push(
            hsv.rgb([
                (360 * Math.floor((i * n) / settings.ws281x.leds)) / n,
                100,
                100,
            ])
        );
    return out;
}

register(
    "Rainbow Stripes",
    rainbow_stripes,
    [
        {
            key: "n",
            type: "integer",
            label: "Colors (count)",
            default: 6,
            min: 1,
            max: 100,
        },
    ],
    "rgb[]"
);
