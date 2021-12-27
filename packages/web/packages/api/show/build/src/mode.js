"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_mode = exports.modes = void 0;
const registry_1 = require("./registry");
const color_convert_1 = __importDefault(require("color-convert"));
exports.modes = {};
function create_mode(x, returnType) {
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
                let func = create_mode(input_value, param.type);
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
                        args[param.key] = color_convert_1.default.hex.rgb(input_value.value);
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
    return func.bind({}, args);
}
exports.create_mode = create_mode;
