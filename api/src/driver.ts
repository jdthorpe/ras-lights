import Driver, { StripType } from "rpi-ws281x-led";
// import settings from "./settings";

export type rgb = [number, number, number];

const LEDS = 300;
// Create the driver. It automatically initializes the underlying components.
const driver = new Driver({
    frequency: 800000,
    channels: [
        {
            gpio: 18,
            count: 8,
            type: StripType.WS2812_STRIP,
            brightness: 64,
        },
        {
            gpio: 13,
            count: LEDS,
            // type: StripType.WS2811_STRIP_RGBW,
            // @ts-ignore
            type: StripType.WS2811_STRIP_RGBW,
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

export function set_colors(colors: rgb[]): void {
    for (let i = 0; i < LEDS; i++) {
        channel1.leds[i] = 0;
        channel1.leds[i] =
            (colors[i % colors.length][0] << 24) |
            (colors[i % colors.length][1] << 16) |
            (colors[i % colors.length][2] << 8);
    }
    channel1.render();
}

export function turn_off(): void {
    channel1.leds.fill(0x000000);
    channel1.render();
}

export function random_colors(): void {
    let r: number, g: number;
    for (let i = 0; i < LEDS; i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        channel1.leds[i] = (r << 16) | (g << 8) | Math.max(255 - r - g, 0);
    }
    channel1.render();
}
