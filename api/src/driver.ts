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

// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L146-L169
const OFF = 0x00000000;
const W = 0x01000000;
const R = 0x00010000;
const G = 0x00000100;
const B = 0x00000001;

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

let driver: Driver;
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
    if (driver) {
        driver.finalize();
    }
    console.log("[init from settings]: re-initializing Driver");
    driver = new Driver({
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
reload_driver();

function render(C: number[]) {
    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        let spec = driver_spec.channels[ch];
        if (spec.reverse) {
            for (let i = 0; i < channel.leds.length; i++)
                channel.leds[channel.leds.length - i - 1] = C[i % C.length];
        } else {
            for (let i = 0; i < channel.leds.length; i++)
                channel.leds[i] = C[i % C.length];
        }
        channel.render();
    }
}

export function set_colors(colors: (rgb | rgbw)[]): void {
    /* Render arrays of numbers to the RGBW Channels */

    const C: number[] = [];

    for (let i = 0; i < colors.length; i++)
        C[i] =
            (R * colors[i % colors.length][0]) |
            (G * colors[i % colors.length][1]) |
            (B * colors[i % colors.length][2]) |
            (W * (colors[i % colors.length][3] || 0));

    render(C);
}

function nx(x: number): number {
    /* transform numbers to the appropriate range */
    return Math.min(255, Math.max(0, Math.floor(x)));
}

export function w(N: number[]): void {
    /* Render numbers to the white channel */

    const _N: number[] = [];
    for (let i = 0; i < N.length; i++) _N[i] = nx(N[i]) * W;

    render(_N);
}

export function white(N = 0): void {
    render([Math.floor(Math.min(255, Math.max(0, N))) * W]);
}

export function turn_off(): void {
    /* set all the colors to 0 */
    render([OFF]);
}

export function random_colors(): void {
    /* generate random colors */
    const C: number[] = [];

    for (let ch = 0; ch < driver.channels.length; ch++) {
        let channel = driver.channels[ch];
        for (let i = 0; i < channel.leds.length; i++)
            C.push(Math.floor(Math.random() * ((1 << 24) - 1)));
    }
    render(C);
}
