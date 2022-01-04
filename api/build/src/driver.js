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
exports.random_colors = exports.turn_off = exports.set_colors = void 0;
const rpi_ws281x_led_1 = __importStar(require("rpi-ws281x-led"));
const LEDS = 300;
// Create the driver. It automatically initializes the underlying components.
const driver = new rpi_ws281x_led_1.default({
    frequency: 800000,
    channels: [
        {
            gpio: 18,
            count: 8,
            type: rpi_ws281x_led_1.StripType.WS2812_STRIP,
            brightness: 64,
        },
        {
            gpio: 13,
            count: LEDS,
            // type: StripType.WS2811_STRIP_RGBW,
            // @ts-ignore
            type: rpi_ws281x_led_1.StripType.WS2811_STRIP_RGBW,
            brightness: 55,
        },
    ],
});
// Create the driver. It automatically initializes the underlying components.
const channel1 = driver.channels[1];
channel1.leds = new Uint32Array(LEDS).fill(0x000000);
channel1.render();
channel1.brightness = 35;
channel1.render(); // OR driver.render();
channel1.leds = new Uint32Array(100).fill(0x000000);
channel1.render();
function set_colors(colors) {
    for (let i = 0; i < LEDS; i++) {
        channel1.leds[i] = 0;
        channel1.leds[i] =
            (colors[i % colors.length][0] << 24) |
                (colors[i % colors.length][1] << 16) |
                (colors[i % colors.length][2] << 8);
    }
    channel1.render();
}
exports.set_colors = set_colors;
function turn_off() {
    channel1.leds.fill(0x000000);
    channel1.render();
}
exports.turn_off = turn_off;
function random_colors() {
    let r, g;
    for (let i = 0; i < LEDS; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        channel1.leds[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    channel1.render();
}
exports.random_colors = random_colors;
