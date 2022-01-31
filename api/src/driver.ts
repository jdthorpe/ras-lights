import Driver, { StripType, ChannelConfiguration } from "rpi-ws281x-led";
import { rgb, rgbw } from "shared/types/mode";
import { adminStore } from "./db";
import { channel, IDriver } from "shared/types/admin";
import equal from "fast-deep-equal";

function asChannel(ch: channel): ChannelConfiguration {
    return {
        ...ch,
        type: StripType[ch.type as keyof typeof StripType],
    };
}
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

let _Driver: Driver;
let driver_spec: IDriver;

export async function reload_driver() {
    const results = await adminStore.findOne<IDriver>(
        { type: "DRIVER" },
        { _id: 0 }
    );

    // FAST PATH
    if (results === null) {
        console.log("fetched driver spec was null");
        return;
    }
    if (equal(driver_spec, results)) {
        console.log(
            "fetched driver spec was not different from the previous spec"
        );
        return;
    }
    driver_spec = results;
    console.log(
        "using driver settings: ",
        JSON.stringify(driver_spec, null, 2)
    );

    console.log("[init from settings]: Finalizing");
    if (_Driver) {
        _Driver.finalize();
    }
    console.log("[init from settings]: re-initializing Driver");
    _Driver = new Driver({
        frequency: results.frequency,
        channels: results.channels.map((ch) => asChannel(ch)),
    });

    console.log("[init from settings]: re-initializing channels");
    for (let i in results.channels) {
        let ch = results.channels[i];
        const channel0 = _Driver.channels[i];
        channel0.leds = new Uint32Array(ch.count).fill(0x000000);
        console.log("brightness: ", ch.brightness);
        channel0.brightness = ch.brightness;
    }
    console.log("[init from settings]: DONE!!");
}
reload_driver();

// Create the driver. It automatically initializes the underlying components.

// const channel0 = driver.channels[0];
// channel0.leds = new Uint32Array(LEDS_0).fill(0x000000);
// channel0.brightness = 35;
// // channel0.render();

// const channel1 = driver.channels[1];
// channel1.leds = new Uint32Array(LEDS_1).fill(0x000000);
// channel1.brightness = 35;
// // channel1.render();

export function set_colors(colors: (rgb | rgbw)[]): void {
    /* Render arrays of numbers to the RGBW Channels */

    const C: number[] = [];

    for (let i = 0; i < colors.length; i++)
        C[i] =
            (R * colors[i % colors.length][0]) |
            (G * colors[i % colors.length][1]) |
            (B * colors[i % colors.length][2]) |
            (W * (colors[i % colors.length][3] || 0));

    for (let ch = 0; ch < _Driver.channels.length; ch++) {
        let channel = _Driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            channel.leds[i] = C[i % C.length];
        channel.render();
    }
    // for (let i = 0; i < LEDS_1; i++) channel1.leds[i] = C[i % C.length];
    // channel1.render();

    // for (let i = 0; i < LEDS_0; i++) channel0.leds[i] = C[i % C.length];
    // channel0.render();
}

function nx(x: number): number {
    /* transform numbers to the appropriate range */
    return Math.min(255, Math.max(0, Math.floor(x)));
}

export function w(N: number[]): void {
    /* Render numbers to the white channel */

    const _N: number[] = [];
    for (let i = 0; i < N.length; i++) _N[i] = nx(N[i]) * W;

    for (let ch = 0; ch < _Driver.channels.length; ch++) {
        let channel = _Driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            channel.leds[i] = _N[i % N.length];
        channel.render();
    }
    // for (let i = 0; i < LEDS_1; i++) channel1.leds[i] = _N[i % N.length];
    // channel1.render();

    // for (let i = 0; i < LEDS_0; i++) channel0.leds[i] = _N[i % N.length];
    // channel0.render();
}

export function white(N = 0): void {
    N = Math.floor(Math.min(255, Math.max(0, N))) * W;

    for (let ch = 0; ch < _Driver.channels.length; ch++) {
        let channel = _Driver.channels[ch];
        channel.leds.fill(N);
        channel.render();
    }

    // channel1.leds.fill(N);
    // channel1.render();
    // channel0.leds.fill(OFF); // yes this is on purpose (the second one doesn't have a white channel)
    // channel0.render();
}

export function turn_off(): void {
    /* set all the colors to 0 */
    for (let ch = 0; ch < _Driver.channels.length; ch++) {
        let channel = _Driver.channels[ch];
        channel.leds.fill(OFF);
        channel.render();
    }
    // channel1.leds.fill(OFF);
    // channel1.render();
    // channel0.leds.fill(OFF);
    // channel0.render();
}

export function random_colors(): void {
    /* generate random colors */

    for (let ch = 0; ch < _Driver.channels.length; ch++) {
        let channel = _Driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            channel.leds[i] = Math.floor(Math.random() * ((1 << 24) - 1));
        channel.render();
    }

    // for (let i = 0; i < LEDS_1; i++)
    //     channel1.leds[i] = Math.floor(Math.random() * ((1 << 24) - 1));
    // channel1.render();

    // for (let i = 0; i < LEDS_0; i++)
    //     channel0.leds[i] = Math.floor(Math.random() * ((1 << 24) - 1));
    // channel0.render();
}
