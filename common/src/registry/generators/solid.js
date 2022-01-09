"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
function solid(x) {
    return [x.a];
}
(0, registry_1.register)("Solid", solid, [
    {
        key: "a",
        type: "rgb",
        label: "Color",
        default: [0, 255, 0],
    },
], "rgb[]");
