"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_descriptors = exports.register = exports.setActiveLibrary = exports.registry = void 0;
const RESERVED_NAMES = ["manual", "none"];
exports.registry = {};
let activeLibrary = undefined;
function setActiveLibrary(name) {
    activeLibrary = name;
}
exports.setActiveLibrary = setActiveLibrary;
function register(args) {
    let { name, func, input, output } = args;
    if (RESERVED_NAMES.indexOf(name) !== -1)
        throw new Error(`Reserved name ${name}`);
    //if (typeof activeLibrary !== "undefined") name = `${activeLibrary}/${name}`;
    console.log(`REGISTER: adding function (${Object.keys(exports.registry).length}) ${activeLibrary ? activeLibrary : "internal"}/${name}`);
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
