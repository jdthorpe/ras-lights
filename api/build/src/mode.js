"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMode = exports.stop = exports.set_updates = exports.get_updates = exports.reset_delay = void 0;
const ajv_1 = __importDefault(require("ajv"));
const shared_1 = require("shared");
const driver_1 = require("./driver");
// import settings from "./settings";
const db_1 = require("./db");
const db_2 = require("./db");
const perf_hooks_1 = require("perf_hooks");
// sudo systemctl stop bluetooth.service && sudo systemctl disable bluetooth.service
// sudo systemctl stop cups.service && sudo systemctl disable cups.service
// sudo systemctl stop alsa-state.service && sudo systemctl disable alsa-state.service
// sudo systemctl stop hciuart.service && sudo systemctl disable hciuart.service
// sudo systemctl stop cups-browsed.service && sudo systemctl disable cups-browsed.service
let DELAY_MS = 50;
let leds;
async function reset_delay() {
    const settings = await db_2.adminStore.findOne({ type: "GENERAL" }, { _id: 0 });
    if (settings !== null) {
        settings.delay_ms && (DELAY_MS = settings.delay_ms);
    }
    const series = settings && typeof settings.series !== undefined
        ? settings.series
        : true;
    const driver_spec = await db_2.adminStore.findOne({ type: "DRIVER" }, { _id: 0 });
    if (driver_spec === null) {
        console.log("fetched driver spec was null");
        return;
    }
    leds = 0;
    for (let i in driver_spec.channels) {
        let ch = driver_spec.channels[i];
        leds = series ? leds + ch.count : Math.max(leds, ch.count);
    }
}
exports.reset_delay = reset_delay;
reset_delay();
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
    const func = (0, shared_1.build_node)(show.def, {
        leds, // : settings.ws281x.leds,
    });
    return func;
}
// ----------------------------------------
// loop
// ----------------------------------------
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
let current_show = 0;
function stop() {
    current_show++;
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
    create_loop(mode, before, after);
}
exports.setMode = setMode;
let prev_error = perf_hooks_1.performance.now();
function create_loop(mode, before, after) {
    const this_show = ++current_show;
    const run = () => {
        const delay = new Promise((resolve) => {
            setTimeout(() => resolve(), DELAY_MS);
        });
        const render = new Promise((resolve) => {
            const A = perf_hooks_1.performance.now();
            before && before();
            const B = perf_hooks_1.performance.now();
            const colors = mode();
            const C = perf_hooks_1.performance.now();
            after && after();
            const D = perf_hooks_1.performance.now();
            if (this_show === current_show && ajv.validate(schema, colors))
                (0, driver_1.set_colors)(colors);
            const E = perf_hooks_1.performance.now();
            const d = E - A;
            // // THIS WAY MADNESS LIES:
            if (d > 100) {
                console.log(`total: ${d.toFixed(1)} before: ${(B - A).toFixed(1)} render: ${(C - B).toFixed(1)} after: ${(D - C).toFixed(1)} render: ${(E - D).toFixed(1)} since: ${(A - prev_error).toFixed(1)}`);
                prev_error = A;
            }
            resolve();
        });
        Promise.all([delay, render]).then(() => {
            this_show === current_show && run();
        });
    };
    run();
}
