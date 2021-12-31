import Ajv from "ajv";
import { build_node } from "@ras-lights/common/src/mode";
import { func_config, rgb, mode } from "@ras-lights/common/types/mode";

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

export interface ILoop {
    start: (x: func_config) => mode;
    stop: () => void;
}

export function make_loop(
    cb: { (colors: rgb[]): any },
    globals: { leds: number }
): ILoop {
    let timeout: ReturnType<typeof setTimeout>;

    return {
        start: (x: func_config) => {
            console.log("(start)");
            const mode = build_node(x, globals);
            timeout && clearTimeout(timeout);

            const fun = () => {
                const colors = mode();
                if (ajv.validate(schema, colors)) {
                    cb(colors);
                } else {
                    console.log("canceling!!!");
                    return;
                }
                timeout = setTimeout(fun, 50);
            };
            fun();
            return mode;
        },
        stop: (): void => {
            timeout && clearTimeout(timeout);
            console.log("Just stopped timeout: ", timeout);
        },
    };
}
