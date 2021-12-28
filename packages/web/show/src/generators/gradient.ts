import { register } from "../registry";
import settings from "../settings";

type rgb = [number, number, number];

function average(a: rgb, b: rgb, w: number): rgb {
    return [
        Math.floor(a[0] * w + b[0] * (1 - w)),
        Math.floor(a[1] * w + b[1] * (1 - w)),
        Math.floor(a[2] * w + b[2] * (1 - w)),
    ];
}

interface input {
    a: rgb;
    b: rgb;
}

function gradient(x: input): rgb[] {
    const out: rgb[] = [];
    for (let i = 0; i < settings.ws281x.leds; i++) {
        out.push(average(x.a, x.b, i / Math.max(settings.ws281x.leds - 1, 1)));
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
        },
        {
            key: "b",
            type: "rgb",
            label: "Second Color",
        },
    ],
    "rgb[]"
);
