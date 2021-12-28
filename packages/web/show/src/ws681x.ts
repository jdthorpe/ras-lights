import ws281x from "rpi-ws281x";
import settings from "./settings";

ws281x.configure(settings.ws281x);

export type rgb = [number, number, number];

export function set_colors(colors: rgb[]): void {
    const pixels = new Uint32Array(settings.ws281x.leds);
    for (let i = 0; i < settings.ws281x.leds; i++) {
        pixels[i] = 0;
        pixels[i] =
            (colors[i % colors.length][0] << 16) |
            (colors[i % colors.length][1] << 8) |
            colors[i % colors.length][2];
    }
    ws281x.render(pixels);
}

export function turn_off(): void {
    const pixels = new Uint32Array(settings.ws281x.leds);
    for (let i = 0; i < settings.ws281x.leds; i++) pixels[i] = 0;
    ws281x.render(pixels);
}

export function random_colors(): void {
    const pixels = new Uint32Array(settings.ws281x.leds);
    let r: number, g: number;
    for (let i = 0; i < settings.ws281x.leds; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        pixels[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    ws281x.render(pixels);
}
