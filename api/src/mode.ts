import Ajv from "ajv";
import { build_node, registry } from "shared";
import { turn_off, set_colors } from "./driver";
import { show, func_config } from "shared/types/mode";
import { globals } from "shared/src/registry";
import { IDriver } from "shared/types/admin";
// import settings from "./settings";
import { modeStore } from "./db";
import { input } from "shared/types/parameters";
import { mode } from "shared/types/mode";
import { ui } from "shared/types/user-input";
import { adminStore } from "./db";
import { general_settings } from "shared/types/admin";
import { performance } from "perf_hooks";

// sudo systemctl stop bluetooth.service && sudo systemctl disable bluetooth.service
// sudo systemctl stop cups.service && sudo systemctl disable cups.service
// sudo systemctl stop alsa-state.service && sudo systemctl disable alsa-state.service
// sudo systemctl stop hciuart.service && sudo systemctl disable hciuart.service
// sudo systemctl stop cups-browsed.service && sudo systemctl disable cups-browsed.service

let DELAY_MS = 50;
let leds: number;

export async function reset_delay() {
    const settings = await adminStore.findOne<general_settings>(
        { type: "GENERAL" },
        { _id: 0 }
    );

    if (settings !== null) {
        settings.delay_ms && (DELAY_MS = settings.delay_ms);
    }

    const series =
        settings && typeof settings.series !== undefined
            ? settings.series
            : true;

    const driver_spec = await adminStore.findOne<IDriver>(
        { type: "DRIVER" },
        { _id: 0 }
    );

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
reset_delay();

const ajv = new Ajv();
const schema = {
    anyOf: [
        {
            type: "array",
            items: {
                type: "array",
                items: { type: "number" },
                minItems: 3,
                maxItems: 4,
            },
        },
        {
            type: "array",
            items: { type: "number", minimum: 0, maximum: 255 },
        },
    ],
};

// ----------------------------------------
// registry
// ----------------------------------------

async function get_show(name: string): Promise<show> {
    // if (name in modes) return modes[name];
    try {
        return await modeStore.findOne({ name });
    } catch (err) {
        throw new Error(`No such mode "${name}"`);
    }
}

const GLOBALS: globals = {
    leds: 1, // : settings.ws281x.leds,
    stop,
    prev: new Array(1).fill([0, 0, 0, 0]),
};

async function get_mode(show: show): Promise<mode> {
    GLOBALS.leds = leds;
    const func = build_node(show.def as func_config, GLOBALS);
    return func;
}

// ----------------------------------------
// loop
// ----------------------------------------
let current_mode: string = "off";
let updates: { [key: string]: string } = {};

export function get_updates() {
    return updates;
}

interface ui_index {
    [k: string]: ui;
}

let unset_values: [mode, string, any][] = [];

function unset(): void {
    for (let [f, key, value] of unset_values) {
        f.__args__[key] = value;
    }
}

function apply_update(mode: mode, show: show, indx: ui_index) {
    for (let [key, value] of Object.entries(updates)) {
        let ui: ui = indx[key];
        if (typeof ui === "undefined") continue;

        let f: mode = mode;
        let s: func_config = show.def as func_config;

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
            let inputs: input[] = registry[s.name][1];
            let inp: input = inputs[ui.path[i]];

            // console.log("[NEXT]  inp =>", inp);
            // console.log("[NEXT]  s.params =>", s.params);
            // console.log("[NEXT]  ui.path[i] =>", ui.path[i]);

            s = s.params[inp.key] as func_config;
            f = Object.getOwnPropertyDescriptor(f.__args__, inp.key)!
                .get as mode;
            // console.log("[NEXT]  s =>", s);
            // console.log("[NEXT]  f =>", f);
        }

        // console.log("Getting the head elemnt");
        // console.log("[HEAD]  s =>", s);
        // console.log("[HEAD]  registry[s.name] =>", registry[s.name]);
        // get the head element
        let inputs: input[] = registry[s.name][1];
        let inp: input = inputs[ui.path[ui.path.length - 1]];
        if (inp.type === "button") unset_values.push([f, inp.key, false]);
        f.__args__[inp.key] = value;
    }
}

export function set_updates(x: { [key: string]: any }) {
    for (let [key, value] of Object.entries(x)) updates[key] = value;
}

let current_show = 0;
export function stop() {
    current_show++;
}

export async function setMode(new_mode: string | show): Promise<void> {
    let show: show;

    if (typeof new_mode == "string") {
        if (new_mode == "none") {
            stop();
            return;
        }
        if (new_mode == "off") {
            stop();
            turn_off();
            return;
        }
        if (current_mode === new_mode) return;

        show = await get_show(new_mode);
    } else {
        show = new_mode;
    }

    if (typeof show === "undefined")
        throw new Error(`No sucn mode "${new_mode}"`);

    const mode: mode = await get_mode(show);

    let before: cb | undefined = undefined;
    let after: cb | undefined = undefined;

    if (typeof show.ui !== "undefined") {
        let indx: ui_index = Object.fromEntries(
            show.ui.map((ui) => [ui.key, ui])
        );
        before = () => apply_update(mode, show, indx);
        after = unset;
    }

    stop();
    // reset the updates before restarting the loop
    updates = {};
    create_loop(mode, before, after);
}

type cb = () => void;

const drive_yourself_crazy_trying_to_debug_periodic_delays = false;

let prev_error = performance.now();
function create_loop(mode: mode, before?: cb, after?: cb): void {
    const this_show = ++current_show;
    const run = () => {
        const delay = new Promise<void>((resolve) => {
            setTimeout(() => resolve(), DELAY_MS);
        });

        const render = new Promise<void>((resolve) => {
            const A = performance.now();
            before && before();
            const B = performance.now();
            const colors = mode();
            const C = performance.now();
            after && after();
            const D = performance.now();
            if (this_show === current_show && ajv.validate(schema, colors)) {
                set_colors(colors);
                GLOBALS.prev = colors;
            }
            const E = performance.now();
            const d = E - A;
            // // THIS WAY MADNESS LIES:
            if (
                drive_yourself_crazy_trying_to_debug_periodic_delays &&
                d > 100
            ) {
                console.log(
                    `total: ${d.toFixed(1)} before: ${(B - A).toFixed(
                        1
                    )} render: ${(C - B).toFixed(1)} after: ${(D - C).toFixed(
                        1
                    )} render: ${(E - D).toFixed(1)} since: ${(
                        A - prev_error
                    ).toFixed(1)}`
                );
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
