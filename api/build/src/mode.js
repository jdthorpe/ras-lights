"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMode = void 0;
const ajv_1 = __importDefault(require("ajv"));
const common_1 = require("@ras-lights/common");
const ws681x_1 = require("./ws681x");
const settings_1 = __importDefault(require("./settings"));
const db_1 = require("./db");
const DELAY_MS = (settings_1.default.api && settings_1.default.api.loop_delay_ms) || 50;
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
// const modes: { [key: string]: { (): any } } = {};
// export function create_node(name: string, x: func_config) {
//     modes[name] = build_node(x, { leds: settings.ws281x.leds });
// }
async function get_mode(name) {
    // if (name in modes) return modes[name];
    let mode;
    try {
        mode = await db_1.modeStore.findOne({ name });
    }
    catch (err) {
        throw new Error(`No such mode "${name}"`);
    }
    const func = (0, common_1.build_node)(mode.def, {
        leds: settings_1.default.ws281x.leds,
    });
    // modes[name] = func;
    return func;
}
// ----------------------------------------
// loop
// ----------------------------------------
let loop;
let current_mode = "off";
async function setMode(new_mode) {
    let mode;
    if (typeof new_mode == "string") {
        if (new_mode == "none") {
            loop && clearTimeout(loop);
            return;
        }
        if (new_mode == "off") {
            loop && clearTimeout(loop);
            (0, ws681x_1.turn_off)();
            return;
        }
        if (current_mode === new_mode)
            return;
        mode = await get_mode(new_mode);
    }
    else {
        mode = new_mode;
    }
    if (typeof mode === "undefined")
        throw new Error(`No sucn mode "${new_mode}"`);
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
        loop = setTimeout(fun, DELAY_MS);
    };
    return fun;
}
