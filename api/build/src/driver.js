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
Object.defineProperty(exports, "__esModule", { value: true });
exports.random_colors = exports.turn_off = exports.white = exports.w = exports.set_colors = void 0;
const rpi_ws281x_led_1 = __importStar(require("rpi-ws281x-led"));
// import settings from "./settings";
const LEDS_0 = 8;
const LEDS_1 = 339;
// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L146-L169
const OFF = 0x00000000; // W
const W = 0x01000000; // W
const R = 0x00010000; // G
const G = 0x00000100; // R
const B = 0x00000001; // B
// Create the driver. It automatically initializes the underlying components.
// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L266-L273
const driver = new rpi_ws281x_led_1.default({
    frequency: 800000,
    channels: [
        {
            gpio: 18,
            count: LEDS_0,
            type: rpi_ws281x_led_1.StripType.WS2811_STRIP_GRB,
            brightness: 64,
        },
        {
            gpio: 13,
            count: LEDS_1,
            type: rpi_ws281x_led_1.StripType.SK6812_STRIP_GRBW,
            brightness: 255,
        },
    ],
});
// Create the driver. It automatically initializes the underlying components.
const channel0 = driver.channels[0];
channel0.leds = new Uint32Array(LEDS_0).fill(0x000000);
channel0.brightness = 35;
// channel0.render();
const channel1 = driver.channels[1];
channel1.leds = new Uint32Array(LEDS_1).fill(0x000000);
channel1.brightness = 35;
// channel1.render();
function set_colors(colors) {
    /* Render arrays of numbers to the RGBW Channels */
    const C = [];
    for (let i = 0; i < colors.length; i++)
        C[i] =
            (R * colors[i % colors.length][0]) |
                (G * colors[i % colors.length][1]) |
                (B * colors[i % colors.length][2]) |
                (W * (colors[i % colors.length][3] || 0));
    for (let i = 0; i < LEDS_1; i++)
        channel1.leds[i] = C[i % C.length];
    channel1.render();
    for (let i = 0; i < LEDS_0; i++)
        channel0.leds[i] = C[i % C.length];
    channel0.render();
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
    for (let i = 0; i < LEDS_1; i++)
        channel1.leds[i] = _N[i % N.length];
    channel1.render();
    for (let i = 0; i < LEDS_0; i++)
        channel0.leds[i] = _N[i % N.length];
    channel0.render();
}
exports.w = w;
function white(N = 0) {
    N = Math.floor(Math.min(255, Math.max(0, N))) * W;
    channel1.leds.fill(N);
    channel1.render();
    channel0.leds.fill(OFF); // yes this is on purpose (the second one doesn't have a white channel)
    channel0.render();
}
exports.white = white;
function turn_off() {
    /* set all the colors to 0 */
    channel1.leds.fill(OFF);
    channel1.render();
    channel0.leds.fill(OFF);
    channel0.render();
}
exports.turn_off = turn_off;
function random_colors() {
    /* generate random colors */
    for (let i = 0; i < LEDS_1; i++)
        channel1.leds[i] = Math.floor(Math.random() * ((1 << 24) - 1));
    channel1.render();
    for (let i = 0; i < LEDS_0; i++)
        channel0.leds[i] = Math.floor(Math.random() * ((1 << 24) - 1));
    channel0.render();
}
exports.random_colors = random_colors;
