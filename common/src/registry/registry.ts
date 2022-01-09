import { input, value, signatures } from "../../types/parameters";

export interface globals {
    leds: number;
}

type func =
    | { (): any }
    | { (inputs: any): any }
    | { (inputs: any, globals: globals): any };

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

export function get_descriptors(): signatures {
    const out: signatures = {};
    for (const [key, value] of Object.entries(registry))
        out[key] = { input: value[1], output: value[2] };
    return out;
}
