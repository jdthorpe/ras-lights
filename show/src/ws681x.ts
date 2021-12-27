import ws281x from "rpi-ws281x";
import settings from "./settings";

ws281x.configure(settings.ws281x);

export type rgb = [number, number, number];

export function set_colors(colors: rgb[]): void {
    console.log("settings.LEDS: ", settings.LEDS);
    const pixels = new Uint32Array(settings.LEDS);
    console.log("pixels.length: ", pixels.length);
    for (let i = 0; i < settings.LEDS; i++) {
        pixels[i] = 0;
        pixels[i] =
            (colors[i % colors.length][0] << 16) |
            (colors[i % colors.length][1] << 8) |
            colors[i % colors.length][2];
    }
    console.log("pixels: ", pixels);
    ws281x.render(pixels);
}

export function turn_off(): void {
    const pixels = new Uint32Array(settings.LEDS);
    for (let i = 0; i < settings.LEDS; i++) pixels[i] = 0;
    ws281x.render(pixels);
}

export function random_colors(): void {
    const pixels = new Uint32Array(settings.LEDS);
    let r: number, g: number;
    for (let i = 0; i < settings.LEDS; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        pixels[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    ws281x.render(pixels);
}
