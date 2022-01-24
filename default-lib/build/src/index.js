"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.register = void 0;
const defs = [];
function register(x) {
    defs.push(x);
}
exports.register = register;
function load(cb) {
    for (let d of defs)
        cb(d);
}
exports.load = load;
// damn those circular imports
require("./rgb");
require("./rgbw");
require("./w");
