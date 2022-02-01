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
// const LEDS_0 = 8;
// const LEDS_1 = 339;
// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L146-L169
const OFF = 0x00000000; // W
const W = 0x01000000; // W
const R = 0x00010000; // G
const G = 0x00000100; // R
const B = 0x00000001; // B
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
async function reload_driver() {
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
    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        let spec = driver_spec.channels[ch];
        if (spec.reverse) {
            for (let i = 0; i < channel.leds.length; i++)
                channel.leds[channel.leds.length - i - 1] = C[i % C.length];
        }
        else {
            for (let i = 0; i < channel.leds.length; i++)
                channel.leds[i] = C[i % C.length];
        }
        channel.render();
    }
}
function set_colors(colors) {
    /* Render arrays of numbers to the RGBW Channels */
    const C = [];
    for (let i = 0; i < colors.length; i++)
        C[i] =
            (R * colors[i % colors.length][0]) |
                (G * colors[i % colors.length][1]) |
                (B * colors[i % colors.length][2]) |
                (W * (colors[i % colors.length][3] || 0));
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
    // for (let ch = 0; ch < _Driver.channels.length; ch++) {
    //     let channel = _Driver.channels[ch];
    //     for (let i = 0; i < channel.leds.length; i++)
    //         channel.leds[i] = _N[i % N.length];
    //     channel.render();
    // }
}
exports.w = w;
function white(N = 0) {
    render([Math.floor(Math.min(255, Math.max(0, N))) * W]);
    // N = Math.floor(Math.min(255, Math.max(0, N))) * W;
    // for (let ch = 0; ch < _Driver.channels.length; ch++) {
    //     let channel = _Driver.channels[ch];
    //     channel.leds.fill(N);
    //     channel.render();
    // }
}
exports.white = white;
function turn_off() {
    /* set all the colors to 0 */
    render([OFF]);
    // for (let ch = 0; ch < _Driver.channels.length; ch++) {
    //     let channel = _Driver.channels[ch];
    //     channel.leds.fill(OFF);
    //     channel.render();
    // }
}
exports.turn_off = turn_off;
function random_colors() {
    /* generate random colors */
    const C = [];
    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            C.push(Math.floor(Math.random() * ((1 << 24) - 1)));
        // channel.leds[i] =
        // channel.render();
    }
    render(C);
}
exports.random_colors = random_colors;
