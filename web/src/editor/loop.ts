import Ajv from "ajv";
import { build_node } from "shared/src/mode";
import { globals } from "shared/src/registry";
import { func_config, rgb, mode } from "shared/types/mode";

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

export interface ILoop {
    start: (x: func_config) => mode;
    stop: () => void;
}

const neurotic_timing_debugging = false;
const verbose = false;

export function make_loop(
    cb: { (colors: rgb[]): any },
    globals: { leds: number }
): ILoop {
    let timeout: ReturnType<typeof setTimeout>;
    let prev_loop_end = +new Date();

    const stop = (): void => {
        console.log(">> stop", timeout);
        typeof timeout !== "undefined" && clearTimeout(timeout);
        console.log("cleared ?? ");
        verbose && console.log("Just stopped timeout: ", timeout);
    };

    const GLOBALS: globals = {
        ...globals,
        prev: new Array(globals.leds).fill([[0, 0, 0, 0]]),
        stop,
    };

    return {
        start: (x: func_config) => {
            verbose && console.log("[make loop] About to build node");
            verbose && console.log(x, globals);
            verbose && console.log("===========");
            const mode = build_node(x, GLOBALS);
            verbose && console.log("[make loop] node built");
            timeout && clearTimeout(timeout);

            const fun = () => {
                let stop = false;
                GLOBALS.stop = () => {
                    stop = true;
                };
                const start_time = +new Date();
                const colors = mode();
                const end_time = +new Date();
                if (ajv.validate(schema, colors)) {
                    GLOBALS.prev = colors;
                    cb(colors);
                } else {
                    verbose && console.log("canceling!!!");
                    return;
                }
                neurotic_timing_debugging &&
                    console.log(
                        `calc_time: ${(end_time - start_time).toFixed(
                            3
                        )} delay time${(start_time - prev_loop_end).toFixed(3)}`
                    );
                prev_loop_end = end_time;
                if (stop) return;
                timeout = setTimeout(fun, 30);
            };
            fun();
            return mode;
        },
        stop,
    };
}
