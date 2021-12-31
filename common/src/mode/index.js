"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_node = void 0;
const color_convert_1 = require("color-convert");
const registry_1 = require("../registry");
function build_node(x, globals) {
    return _build_node(x, "rgb[]", globals);
}
exports.build_node = build_node;
function _build_node(x, returnType, globals) {
    // get the function and its types from the registry
    const f = registry_1.registry[x.name];
    if (typeof f === "undefined") {
        throw new Error(`Unknown function ${x.name}. Known functions include: ${Object.keys(registry_1.registry).reduce((a, b) => `${a}, ${b}`)}`);
    }
    const [func, inputs, value] = f;
    if (returnType !== value) {
        throw new Error(`Expected return type "${returnType}" but registry functiom ${x.name} returns ${value}`);
    }
    const args = {};
    // iterate over the required inputs
    for (let param of inputs) {
        // get the input value
        let input_value = x.params[param.key];
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
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
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
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
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
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
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
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
                    }
                }
                break;
            }
            case "hex": {
                switch (param.type) {
                    case "rgb": {
                        args[param.key] = color_convert_1.hex.rgb(input_value.value);
                        break;
                    }
                    default: {
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
                    }
                }
                break;
            }
            case "hex[]": {
                switch (param.type) {
                    case "rgb": {
                        args[param.key] = input_value.value.map((val) => color_convert_1.hex.rgb(val));
                        break;
                    }
                    default: {
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
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
                        throw new Error(`Parameter type ${input_value.type} is not compatible with input type ${param.type}`);
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
    let out;
    if (func.length === 0) {
        out = func.bind({});
    }
    else if (func.length === 1) {
        out = func.bind({}, args);
    }
    else {
        out = func.bind({}, args, globals);
    }
    out.__args__ = args;
    return out;
}
