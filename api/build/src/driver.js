"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random_colors = exports.turn_off = exports.white = exports.w = exports.set_colors = exports.reload_driver = void 0;
const rpi_ws281x_led_1 = __importStar(require("rpi-ws281x-led"));
const db_1 = require("./db");
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
function asChannel(ch) {
    return {
        ...ch,
        type: rpi_ws281x_led_1.StripType[ch.type],
    };
}
// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L146-L169
const OFF = 0x00000000;
const W = 0x01000000;
const R = 0x00010000;
const G = 0x00000100;
const B = 0x00000001;
// Create the driver. It automatically initializes the underlying components.
// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L266-L273
// const driver = new Driver({
//     frequency: 800000,
//     channels: [
//         {
//             gpio: 18,
//             count: LEDS_0,
//             type: StripType.WS2811_STRIP_GRB,
//             brightness: 64,
//         },
//         {
//             gpio: 13,
//             count: LEDS_1,
//             type: StripType.SK6812_STRIP_GRBW,
//             brightness: 255,
//         },
//     ],
// });
let driver;
let driver_spec;
let render_in_series = true;
async function reload_driver() {
    try {
        const settings = await db_1.adminStore.findOne({ type: "GENERAL" }, { _id: 0 });
        if (settings && typeof settings.series !== undefined)
            render_in_series = settings.series;
    }
    catch (err) {
        console.log("something went wrong when fetching the general settings", err);
    }
    const results = await db_1.adminStore.findOne({ type: "DRIVER" }, { _id: 0 });
    // FAST PATH
    if (results === null) {
        console.log("fetched driver spec was null");
        return;
    }
    if ((0, fast_deep_equal_1.default)(driver_spec, results)) {
        console.log("fetched driver spec was not different from the previous spec");
        return;
    }
    driver_spec = results;
    console.log("using driver settings: ", JSON.stringify(driver_spec, null, 2));
    console.log("[init from settings]: Finalizing");
    if (driver) {
        driver.finalize();
    }
    console.log("[init from settings]: re-initializing Driver");
    driver = new rpi_ws281x_led_1.default({
        frequency: results.frequency,
        channels: results.channels.map((ch) => asChannel(ch)),
    });
    console.log("[init from settings]: re-initializing channels");
    for (let i in results.channels) {
        let ch = results.channels[i];
        const channel0 = driver.channels[i];
        channel0.leds = new Uint32Array(ch.count).fill(0x000000);
        console.log("brightness: ", ch.brightness);
        channel0.brightness = ch.brightness;
    }
    console.log("[init from settings]: DONE!!");
}
exports.reload_driver = reload_driver;
reload_driver();
function render(C) {
    let j = 0;
    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        let spec = driver_spec.channels[ch];
        if (spec.reverse) {
            for (let i = 0; i < channel.leds.length; i++) {
                channel.leds[channel.leds.length - i - 1] = C[j % C.length];
                j++;
            }
        }
        else {
            for (let i = 0; i < channel.leds.length; i++) {
                channel.leds[i] = C[j % C.length];
                j++;
            }
        }
        if (!render_in_series)
            j = 0;
        channel.render();
    }
}
function set_colors(colors) {
    /* Render arrays of numbers to the RGBW Channels */
    let _colors;
    if (typeof colors[0] === "number") {
        _colors = colors.map((n) => [
            0,
            0,
            0,
            Math.min(Math.max(n, 0), 255),
        ]);
    }
    else {
        _colors = colors;
    }
    const C = [];
    for (let i = 0; i < _colors.length; i++)
        C[i] =
            (R * _colors[i % _colors.length][0]) |
                (G * _colors[i % _colors.length][1]) |
                (B * _colors[i % _colors.length][2]) |
                (W * (_colors[i % _colors.length][3] || 0));
    render(C);
}
exports.set_colors = set_colors;
function nx(x) {
    /* transform numbers to the appropriate range */
    return Math.min(255, Math.max(0, Math.floor(x)));
}
function w(N) {
    /* Render numbers to the white channel */
    const _N = [];
    for (let i = 0; i < N.length; i++)
        _N[i] = nx(N[i]) * W;
    render(_N);
}
exports.w = w;
function white(N = 0) {
    render([Math.floor(Math.min(255, Math.max(0, N))) * W]);
}
exports.white = white;
function turn_off() {
    /* set all the colors to 0 */
    render([OFF]);
}
exports.turn_off = turn_off;
function random_colors() {
    /* generate random colors */
    const C = [];
    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            C.push(Math.floor(Math.random() * ((1 << 24) - 1)));
    }
    render(C);
}
exports.random_colors = random_colors;
