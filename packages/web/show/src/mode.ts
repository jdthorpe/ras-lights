import { turn_off, set_colors } from "./ws681x";
import Ajv from "ajv";

import { registry } from "./registry";
import { hex } from "color-convert";
import { value } from "./data-types";

const ajv = new Ajv();
const schema = {
    type: "array",
    items: {
        type: "array",
        items: { type: "number" },
        minItems: 3,
        maxItems: 3,
    },
};

// ----------------------------------------
// registry
// ----------------------------------------
const modes: { [key: string]: { (): any } } = {};

export function create_node(name: string, x: func_config) {
    modes[name] = build_node(x, "rgb[]");
}

// ----------------------------------------
// loop
// ----------------------------------------

let loop: ReturnType<typeof setTimeout>;
let current_mode: string = "off";

export function setMode(name: string) {
    if (name == "none") {
        loop && clearTimeout(loop);
        return;
    }
    if (name == "off") {
        loop && clearTimeout(loop);
        turn_off();
        return;
    }
    if (current_mode === name) return;

    const mode = modes[name];
    if (typeof mode === "undefined") throw new Error(`No sucn mode "${name}"`);

    loop && clearTimeout(loop);
    loop = setTimeout(create_loop(mode), 0);
}

function create_loop(mode: { (): any }): { (): void } {
    const fun = () => {
        const colors = mode();
        // console.log("colors", JSON.stringify(colors));
        if (ajv.validate(schema, colors)) {
            set_colors(colors);
        } else {
            return;
        }
        loop = setTimeout(fun, 50);
    };
    return fun;
}

// ----------------------------------------
// mode builder
// ----------------------------------------

function build_node(x: func_config, returnType: value): { (): any } {
    const f = registry[x.name];
    if (typeof f === "undefined") {
        throw new Error(
            `Unknown function ${x.name}. Known functions include: ${Object.keys(
                registry
            ).reduce((a, b) => `${a}, ${b}`)}`
        );
    }
    const [func, inputs, value] = f;

    if (returnType !== value) {
        throw new Error(
            `Expected return type "${returnType}" but registry functiom ${x.name} returns ${value}`
        );
    }

    const args: any = {};

    // iterate over the required inputs
    for (let param of inputs) {
        // get the input value
        let input_value: mode_param = x.params[param.key];

        if (typeof input_value === "undefined")
            throw new Error("missing input parameter ${param.key}");

        switch (input_value.type) {
            case "func": {
                let func = build_node(input_value, param.type);
                Object.defineProperty(args, param.key, { get: func });
                break;
            }
            case "number": {
                switch (param.type) {
                    case "integer":
                    case "number": {
                        args[param.key] = input_value.value;
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            case "integer": {
                switch (param.type) {
                    case "integer": {
                        args[param.key] = input_value.value;
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            case "rgb": {
                switch (param.type) {
                    case "rgb": {
                        args[param.key] = input_value.value;
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            case "rgb[]": {
                switch (param.type) {
                    case "rgb[]": {
                        args[param.key] = input_value.value;
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            case "hex": {
                switch (param.type) {
                    case "rgb": {
                        args[param.key] = hex.rgb(input_value.value);
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            case "boolean": {
                switch (param.type) {
                    case "boolean": {
                        args[param.key] = input_value.value;
                        break;
                    }
                    default: {
                        throw new Error(
                            `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                        );
                    }
                }
                break;
            }
            default: {
                // @ts-ignore
                throw new Error(`unknown parameter type ${input_value.type}`);
            }
        }
    }

    return func.bind({}, args);
}

export type mode_param =
    | func_config
    | num_value
    | int_value
    | rgb_value
    | hex_value
    | rgb_array_value
    | bool_value;

export interface func_config {
    type: "func";
    name: string;
    params: { [key: string]: mode_param };
}

export type rgb = [number, number, number];
export type rgbw = [number, number, number, number];
export type hsv = [number, number, number];

export interface num_value {
    type: "number";
    value: number;
}
export interface int_value {
    type: "integer";
    value: number;
}

export interface hex_value {
    type: "hex";
    value: string;
}

export interface rgb_value {
    type: "rgb";
    value: rgb;
}

export interface rgb_array_value {
    type: "rgb[]";
    value: rgb[];
}

export interface bool_value {
    type: "boolean";
    value: boolean;
}
