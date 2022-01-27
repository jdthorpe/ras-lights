"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMode = exports.stop = exports.set_updates = exports.get_updates = void 0;
const ajv_1 = __importDefault(require("ajv"));
const shared_1 = require("shared");
// import { turn_off, set_colors } from "./ws681x";
const driver_1 = require("./driver");
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
async function get_show(name) {
    // if (name in modes) return modes[name];
    try {
        return await db_1.modeStore.findOne({ name });
    }
    catch (err) {
        throw new Error(`No such mode "${name}"`);
    }
}
async function get_mode(show) {
    // if (name in modes) return modes[name];
    const func = (0, shared_1.build_node)(show.def, {
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
let updates = {};
function get_updates() {
    return updates;
}
exports.get_updates = get_updates;
let unset_values = [];
function unset() {
    for (let [f, key, value] of unset_values) {
        f.__args__[key] = value;
    }
}
function apply_update(mode, show, indx) {
    for (let [key, value] of Object.entries(updates)) {
        let ui = indx[key];
        if (typeof ui === "undefined")
            continue;
        let f = mode;
        let s = show.def;
        // console.log("=================== ");
        // console.log("UI: ", ui);
        // console.log(
        //     `Known functions include: ${Object.keys(registry).reduce(
        //         (a, b) => (a === "" ? b : `${a}, ${b}`),
        //         ""
        //     )}`
        // );
        // walk up the chain
        // console.log("walk up the chain");
        for (let i = 0; i < ui.path.length - 1; i++) {
            // all but the last should be func_config objects, hence length - 1
            // console.log("[WALK]  s =>", s);
            // console.log("[WALK]  registry[s.name] =>", registry[s.name]);
            let inputs = shared_1.registry[s.name][1];
            let inp = inputs[ui.path[i]];
            // console.log("[NEXT]  inp =>", inp);
            // console.log("[NEXT]  s.params =>", s.params);
            // console.log("[NEXT]  ui.path[i] =>", ui.path[i]);
            s = s.params[inp.key];
            f = Object.getOwnPropertyDescriptor(f.__args__, inp.key)
                .get;
            // console.log("[NEXT]  s =>", s);
            // console.log("[NEXT]  f =>", f);
        }
        // console.log("Getting the head elemnt");
        // console.log("[HEAD]  s =>", s);
        // console.log("[HEAD]  registry[s.name] =>", registry[s.name]);
        // get the head element
        let inputs = shared_1.registry[s.name][1];
        let inp = inputs[ui.path[ui.path.length - 1]];
        if (inp.type === "button")
            unset_values.push([f, inp.key, false]);
        f.__args__[inp.key] = value;
    }
}
function set_updates(x) {
    for (let [key, value] of Object.entries(x))
        updates[key] = value;
}
exports.set_updates = set_updates;
function stop() {
    loop && clearTimeout(loop);
}
exports.stop = stop;
async function setMode(new_mode) {
    let show;
    if (typeof new_mode == "string") {
        if (new_mode == "none") {
            stop();
            return;
        }
        if (new_mode == "off") {
            stop();
            (0, driver_1.turn_off)();
            return;
        }
        if (current_mode === new_mode)
            return;
        show = await get_show(new_mode);
    }
    else {
        show = new_mode;
    }
    if (typeof show === "undefined")
        throw new Error(`No sucn mode "${new_mode}"`);
    const mode = await get_mode(show);
    let before = undefined;
    let after = undefined;
    if (typeof show.ui !== "undefined") {
        let indx = Object.fromEntries(show.ui.map((ui) => [ui.key, ui]));
        before = () => apply_update(mode, show, indx);
        after = unset;
    }
    stop();
    // reset the updates before restarting the loop
    updates = {};
    loop = setTimeout(create_loop(mode, before, after), 0);
}
exports.setMode = setMode;
function create_loop(mode, before, after) {
    const fun = () => {
        before && before();
        const colors = mode();
        after && after();
        if (ajv.validate(schema, colors)) {
            (0, driver_1.set_colors)(colors);
        }
        else {
            return;
        }
        loop = setTimeout(fun, DELAY_MS);
    };
    return fun;
}
