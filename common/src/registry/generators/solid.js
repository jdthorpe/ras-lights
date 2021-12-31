"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function solid(x) {
    return [x.a];
}
(0, index_1.register)("Solid", solid, [
    {
        key: "a",
        type: "rgb",
        label: "Color",
        default: [0, 255, 0],
    },
], "rgb[]");
