"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random_colors = exports.turn_off = exports.set_colors = void 0;
const rpi_ws281x_1 = __importDefault(require("rpi-ws281x"));
const settings_1 = __importDefault(require("./settings"));
rpi_ws281x_1.default.configure(settings_1.default.ws281x);
function set_colors(colors) {
    console.log("settings.LEDS: ", settings_1.default.LEDS);
    const pixels = new Uint32Array(settings_1.default.LEDS);
    console.log("pixels.length: ", pixels.length);
    for (let i = 0; i < settings_1.default.LEDS; i++) {
        pixels[i] = 0;
        pixels[i] =
            (colors[i % colors.length][0] << 16) |
                (colors[i % colors.length][1] << 8) |
                colors[i % colors.length][2];
    }
    console.log("pixels: ", pixels);
    rpi_ws281x_1.default.render(pixels);
}
exports.set_colors = set_colors;
function turn_off() {
    const pixels = new Uint32Array(settings_1.default.LEDS);
    for (let i = 0; i < settings_1.default.LEDS; i++)
        pixels[i] = 0;
    rpi_ws281x_1.default.render(pixels);
}
exports.turn_off = turn_off;
function random_colors() {
    const pixels = new Uint32Array(settings_1.default.LEDS);
    let r, g;
    for (let i = 0; i < settings_1.default.LEDS; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        pixels[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    rpi_ws281x_1.default.render(pixels);
}
exports.random_colors = random_colors;
