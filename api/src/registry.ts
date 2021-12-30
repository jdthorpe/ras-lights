import {
    input,
    value,
    values,
    signature,
} from "@ras-lights/common/types/parameters";

type func = { (): any } | { (inputs: any): any };

const RESERVED_NAMES = ["manual", "none"];

export const registry: {
    [x: string]: [func, input[], value]; // | values
} = {};

export function register(
    name: string,
    func: func,
    input: input[],
    output: value // | values
): void {
    if (RESERVED_NAMES.indexOf(name) !== -1)
        throw new Error(`Reserved name ${name}`);

    if (name in registry)
        console.log(`WARNING: overwriting existing registry function ${name}`);

    registry[name] = [func, input, output];
}

// export interface descriptor {
//     in: input[];
//     out: value | values;
// }
interface d {
    [key: string]: signature;
}

export function get_descriptors(): d {
    const out: d = {};
    for (const [key, value] of Object.entries(registry))
        out[key] = { input: value[1], output: value[2] };
    return out;
}

import "./effects";
import "./generators";
