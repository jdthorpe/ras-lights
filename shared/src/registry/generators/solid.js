"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
function solid(x) {
    return [x.a];
}
(0, __1.register)("Solid", solid, [
    {
        key: "a",
        type: "rgb",
        label: "Color",
        default: [0, 255, 0],
    },
], "rgb[]");