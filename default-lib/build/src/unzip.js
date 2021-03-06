"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../register");
function effect(x, globals) {
    const colors = x.colors;
    const even_colors = colors.filter((c, i) => {
        return i % 2 === 0;
    });
    const odd_colors = colors.filter((c, i) => {
        return i % 2 === 1;
    });
    return [...even_colors, ...odd_colors.reverse()];
}
(0, register_1.register)({
    /* Effect Name */
    name: "Unzip",
    /* Effect Function */
    func: effect,
    /* Effect Inputs */
    input: [
        {
            key: "colors",
            type: "rgb[]",
            label: "Input Colors",
            default: [
                [0, 0, 255],
                [0, 255, 255],
                [100, 0, 255],
            ],
        },
    ],
    /* Effect Output Type */
    output: "rgb[]",
});
