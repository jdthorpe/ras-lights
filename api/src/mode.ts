import Ajv from "ajv";
import { build_node, registry } from "shared";
// import { turn_off, set_colors } from "./ws681x";
import { turn_off, set_colors } from "./driver";
import { show, func_config, rgb } from "shared/types/mode";
import settings from "./settings";
import { modeStore } from "./db";
import { input } from "shared/types/parameters";
import { mode } from "shared/types/mode";
import { ui } from "shared/types/user-input";
import * as bluebird from "bluebird";

const DELAY_MS = (settings.api && settings.api.loop_delay_ms) || 50;

const ajv = new Ajv();
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

async function get_show(name: string): Promise<show> {
    // if (name in modes) return modes[name];
    try {
        return await modeStore.findOne({ name });
    } catch (err) {
        throw new Error(`No such mode "${name}"`);
    }
}

async function get_mode(show: show): Promise<mode> {
    // if (name in modes) return modes[name];
    const func = build_node(show.def as func_config, {
        leds: settings.ws281x.leds,
    });
    // modes[name] = func;
    return func;
}

// ----------------------------------------
// loop
// ----------------------------------------
let running: boolean = false;
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

export function stop() {
    running = false;
    console.log("[STOP] typeof next", typeof next);
    next && next.cancel();
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
let next: ReturnType<typeof bluebird.Promise.all>;

function create_loop(mode: mode, before?: cb, after?: cb): void {
    const run = () => {
        const delay = new Promise<void>((resolve) => {
            setTimeout(() => resolve(), DELAY_MS);
        });

        const render = new Promise<void>((resolve) => {
            before && before();
            const colors = mode();
            after && after();
            if (ajv.validate(schema, colors)) set_colors(colors);
            resolve();
        });

        // @ts-ignore
        next = bluebird.Promise.all([delay, render]).then(() => {
            if (!running) console.log("[LOOP] stoping b/c not running");
            running && run();
        });
    };

    running = true;
    run();
}
