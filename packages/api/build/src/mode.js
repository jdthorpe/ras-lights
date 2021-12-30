"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMode = exports.create_node = void 0;
const ajv_1 = __importDefault(require("ajv"));
const color_convert_1 = require("color-convert");
const registry_1 = require("./registry");
const ws681x_1 = require("./ws681x");
const ajv = new ajv_1.default();
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
const modes = {};
function create_node(name, x) {
    modes[name] = build_node(x, "rgb[]");
}
exports.create_node = create_node;
// ----------------------------------------
// loop
// ----------------------------------------
let loop;
let current_mode = "off";
function setMode(name) {
    if (name == "none") {
        loop && clearTimeout(loop);
        return;
    }
    if (name == "off") {
        loop && clearTimeout(loop);
        (0, ws681x_1.turn_off)();
        return;
    }
    if (current_mode === name)
        return;
    const mode = modes[name];
    if (typeof mode === "undefined")
        throw new Error(`No sucn mode "${name}"`);
    loop && clearTimeout(loop);
    loop = setTimeout(create_loop(mode), 0);
}
exports.setMode = setMode;
function create_loop(mode) {
    const fun = () => {
        const colors = mode();
        // console.log("colors", JSON.stringify(colors));
        if (ajv.validate(schema, colors)) {
            (0, ws681x_1.set_colors)(colors);
        }
        else {
            return;
        }
        loop = setTimeout(fun, 50);
    };
    return fun;
}
// ----------------------------------------
// mode builder
// ----------------------------------------
function build_node(x, returnType) {
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
    return func.bind({}, args);
}
