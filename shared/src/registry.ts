import { input, value, signatures } from "../types/parameters";
import { rgb, rgbw } from "../types/mode";

export interface globals {
    leds: number;
    stop: () => void;
    prev: rgb[] | rgbw[] | number[];
}

type func =
    | { (): any }
    | { (inputs: any): any }
    | { (inputs: any, globals: globals): any };

const RESERVED_NAMES = ["manual", "none"];

export const registry: {
    [x: string]: [func, input[], value]; // | values
} = {};

let activeLibrary: string | undefined = undefined;

export function setActiveLibrary(name?: string) {
    activeLibrary = name;
}

interface args {
    name: string;
    func: func;
    input: input[];
    output: value; // | values
}
export function register(args: args): void {
    let { name, func, input, output } = args;
    if (RESERVED_NAMES.indexOf(name) !== -1)
        throw new Error(`Reserved name ${name}`);

    //if (typeof activeLibrary !== "undefined") name = `${activeLibrary}/${name}`;

    console.log(
        `REGISTER: adding function (${Object.keys(registry).length}) ${
            activeLibrary ? activeLibrary : "internal"
        }/${name}`
    );

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
