import Ajv from "ajv";
import { build_node } from "@ras-lights/common";
import { turn_off, set_colors } from "./ws681x";
import { func_config, rgb } from "@ras-lights/common/types/mode";
import settings from "./settings";
import { modeStore } from "./db";

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
const modes: { [key: string]: { (): any } } = {};

export function create_node(name: string, x: func_config) {
    modes[name] = build_node(x, { leds: settings.ws281x.leds });
}

async function get_mode(name: string): Promise<() => any> {
    if (name in modes) return modes[name];
    let mode: func_config;
    try {
        mode = await modeStore.findOne({ name });
    } catch (err) {
        throw new Error(`No such mode "${name}"`);
    }
    const func = build_node(mode, { leds: settings.ws281x.leds });
    modes[name] = func;
    return func;
}

// ----------------------------------------
// loop
// ----------------------------------------

let loop: ReturnType<typeof setTimeout>;
let current_mode: string = "off";

export async function setMode(new_mode: string | { (): rgb[] }) {
    let mode: { (): any };
    if (typeof new_mode == "string") {
        if (new_mode == "none") {
            loop && clearTimeout(loop);
            return;
        }
        if (new_mode == "off") {
            loop && clearTimeout(loop);
            turn_off();
            return;
        }
        if (current_mode === new_mode) return;

        mode = await get_mode(new_mode);
    } else {
        mode = new_mode;
    }

    if (typeof mode === "undefined")
        throw new Error(`No sucn mode "${new_mode}"`);

    loop && clearTimeout(loop);
    loop = setTimeout(create_loop(mode), 0);
}

function create_loop(mode: { (): any }): { (): void } {
    const fun = () => {
        const colors = mode();
        // console.log("colors", JSON.stringify(colors));
        if (ajv.validate(schema, colors)) {
            set_colors(colors);
        } else {
            return;
        }
        loop = setTimeout(fun, 50);
    };
    return fun;
}
