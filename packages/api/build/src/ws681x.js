"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random_colors = exports.turn_off = exports.set_colors = void 0;
// @ts-ignore
const rpi_ws281x_1 = __importDefault(require("rpi-ws281x"));
const settings_1 = __importDefault(require("./settings"));
// console.log("ws281x settings: ", settings.ws281x);
rpi_ws281x_1.default.configure(settings_1.default.ws281x);
function set_colors(colors) {
    const pixels = new Uint32Array(settings_1.default.ws281x.leds);
    for (let i = 0; i < settings_1.default.ws281x.leds; i++) {
        pixels[i] = 0;
        pixels[i] =
            (colors[i % colors.length][0] << 16) |
                (colors[i % colors.length][1] << 8) |
                colors[i % colors.length][2];
    }
    rpi_ws281x_1.default.render(pixels);
}
exports.set_colors = set_colors;
function turn_off() {
    const pixels = new Uint32Array(settings_1.default.ws281x.leds);
    for (let i = 0; i < settings_1.default.ws281x.leds; i++)
        pixels[i] = 0;
    rpi_ws281x_1.default.render(pixels);
}
exports.turn_off = turn_off;
function random_colors() {
    const pixels = new Uint32Array(settings_1.default.ws281x.leds);
    let r, g;
    for (let i = 0; i < settings_1.default.ws281x.leds; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        pixels[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    rpi_ws281x_1.default.render(pixels);
}
exports.random_colors = random_colors;
