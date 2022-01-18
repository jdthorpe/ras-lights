import Driver, { StripType } from "rpi-ws281x-led";
import { rgb } from "shared/types/mode";
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
const driver = new Driver({
    frequency: 800000,
    channels: [
        {
            gpio: 18,
            count: LEDS_0,
            // type: StripType.WS2812_STRIP,
            type: StripType.WS2811_STRIP_GRB,
            brightness: 64,
        },
        {
            gpio: 13,
            count: LEDS_1,
            // type: StripType.WS2811_STRIP_RGBW,
            type: StripType.SK6812_STRIP_GRBW,
            brightness: 255,
        },
    ],
});

// Create the driver. It automatically initializes the underlying components.

const channel0 = driver.channels[0];
channel0.leds = new Uint32Array(LEDS_0).fill(0x000000);
channel0.brightness = 35;
channel0.render();

const channel1 = driver.channels[1];
channel1.leds = new Uint32Array(LEDS_1).fill(0x000000);
channel1.brightness = 35;
channel1.render();

// channel1.render(); // OR driver.render();

export function set_colors(colors: rgb[]): void {
    for (let i = 0; i < LEDS_1; i++) {
        channel1.leds[i] = 0;
        channel1.leds[i] =
            (R * colors[i % colors.length][0]) |
            (G * colors[i % colors.length][1]) |
            (B * colors[i % colors.length][2]);
    }
    channel1.render();

    for (let i = 0; i < LEDS_0; i++) {
        channel0.leds[i] = 0;
        channel0.leds[i] =
            (R * colors[i % colors.length][0]) |
            (G * colors[i % colors.length][1]) |
            (B * colors[i % colors.length][2]);
    }
    channel0.render();
}

export function white(N = 0): void {
    N = Math.floor(Math.min(255, Math.max(0, N))) * W;

    channel1.leds.fill(N);
    channel1.render();
    channel0.leds.fill(OFF);
    channel0.render();
}

export function turn_off(): void {
    channel1.leds.fill(OFF);
    channel1.render();
    channel0.leds.fill(OFF);
    channel0.render();
}

export function random_colors(): void {
    let r: number, g: number;
    for (let i = 0; i < LEDS_1; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        channel1.leds[i] = (R * r) | (G * g) | (B * Math.max(255 - r - g, 0));
    }
    channel1.render();

    for (let i = 0; i < LEDS_0; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        channel0.leds[i] = (R * r) | (G * g) | (B * Math.max(255 - r - g, 0));
    }
    channel0.render();
}
