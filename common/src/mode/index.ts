import { value } from "../../types/parameters";
import { func_config, mode_param, mode } from "../../types/mode";
import { registry, globals } from "../registry";

export function build_node(x: func_config, globals: globals): mode {
    return _build_node(x, "rgb[]", globals);
}

function _build_node(
    x: func_config,
    returnType: value,
    globals: globals
): { (): any; __args__: any } {
    // get the function and its types from the registry
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
            case "button": {
                switch (param.type) {
                    case "button": {
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
                let exhaustivenessCheck: never = input_value;
                console.log(exhaustivenessCheck);
                // @ts-ignore
                throw new Error(`unknown input type ${input_value.type}`);
            }
        }
    }

    let out: { (): any; __args__?: any };
    if (func.length === 0) {
        out = (func as { (): any }).bind({});
    } else if (func.length === 1) {
        out = func.bind({}, args);
    } else {
        out = func.bind({}, args, globals);
    }
    out.__args__ = args;
    return out as { (): any; __args__: any };
}
