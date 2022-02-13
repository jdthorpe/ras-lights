import { value } from "../types/parameters";
import { func_config, mode_param, mode } from "../types/mode";
import { registry, globals } from "./registry";

export function build_node(x: func_config, globals: globals): mode {
    console.log("[build_node] about to build node: ", JSON.stringify(x));
    const node = _build_node(x, ["rgb[]", "rgbw[]", "number[]"], globals);
    console.log("[build_node]  finished building node: ", node);
    return node;
}

function _build_node(
    x: func_config,
    returnType: value | value[],
    globals: globals
): { (): any; __args__: any } {
    console.log("[_build_node] got config: ", x);
    // get the function and its types from the registry
    const f = registry[x.name];
    console.log(
        "[_build_node] got config: ",
        x,
        "name:",
        x.name,
        "exists: ",
        x.name in registry
    );
    if (typeof f === "undefined") {
        console.log("throwing");
        throw new Error(
            `Unknown function ${x.name}. Known functions include: ${Object.keys(
                registry
            ).reduce((a, b) => (a === "" ? b : `${a}, ${b}`), "")}`
        );
    }
    const [func, inputs, value] = f;

    if (Array.isArray(returnType)) {
        if (returnType.indexOf(value) === -1)
            throw new Error(
                `Expected return type in "${returnType}" but registry function ${x.name} returns ${value}`
            );
    } else if (returnType !== value) {
        throw new Error(
            `Expected return type "${returnType}" but registry function ${x.name} returns ${value}`
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
                let func = _build_node(input_value, param.type, globals);
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
            case "boolean":
            case "integer":
            case "button":
            case "number[]":
            case "rgbw":
            case "rgbw[]":
            case "rgb":
            case "rgb[]": {
                if (param.type !== input_value.type)
                    throw new Error(
                        `Parameter type ${input_value.type} is not compatible with input type ${param.type}`
                    );
                args[param.key] = input_value.value;
                break;
            }
            default: {
                let exhaustivenessCheck: never = input_value;
                console.log(exhaustivenessCheck);
                // @ts-ignore
                throw new Error(`unknown input type ${input_value.type}`);
            }
        }
    }

    let out: { (): any; __args__?: any };
    if (func.length === 0) {
        out = (func as { (): any }).bind(/* this */ {});
    } else if (func.length === 1) {
        out = func.bind(/* this */ {}, args);
    } else {
        out = func.bind(/* this */ {}, args, globals);
    }
    out.__args__ = args;
    return out as { (): any; __args__: any };
}
