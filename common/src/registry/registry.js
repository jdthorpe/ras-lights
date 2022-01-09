"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_descriptors = exports.register = exports.registry = void 0;
const RESERVED_NAMES = ["manual", "none"];
exports.registry = {};
function register(name, func, input, output // | values
) {
    if (RESERVED_NAMES.indexOf(name) !== -1)
        throw new Error(`Reserved name ${name}`);
    if (name in exports.registry)
        console.log(`WARNING: overwriting existing registry function ${name}`);
    exports.registry[name] = [func, input, output];
}
exports.register = register;
function get_descriptors() {
    const out = {};
    for (const [key, value] of Object.entries(exports.registry))
        out[key] = { input: value[1], output: value[2] };
    return out;
}
exports.get_descriptors = get_descriptors;
