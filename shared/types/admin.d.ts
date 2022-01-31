export interface user_library {
    path: string;
    name: string;
}

export interface user_library_data extends user_library {
    type: "LIBRARY";
    // use: boolean;
    // watch: boolean;
}

export interface DriverData extends IDriver {
    type: "DRIVER";
}

export interface IDriver {
    dma: numbmer;
    frequency: number;
    channels: channel[];
}

export interface channel {
    gpio: number;
    count: number;
    invert: boolean;
    type: keyof typeof StripType;
    brightness: number;
}

export type ISTRIP_TYPE =
    | "WS2811_STRIP_RGB"
    | "WS2811_STRIP_RBG"
    | "WS2811_STRIP_GBR"
    | "WS2811_STRIP_GRB"
    | "WS2811_STRIP_BRG"
    | "WS2811_STRIP_BGR"
    | "SK6812_STRIP_RGBW"
    | "SK6812_STRIP_RBGW"
    | "SK6812_STRIP_GBRW"
    | "SK6812_STRIP_GRBW"
    | "SK6812_STRIP_BRGW"
    | "SK6812_STRIP_BGRW";

/*

// https://github.com/jgarff/rpi_ws281x/blob/ee7522e3b053950af33bc7e4364742cd3aeaf594/main.c#L266-L273

	PWM0 12, 18, 40, and 52.
	PWM1 13, 19, 41, 45 and 53.
	PCM_DOUT,  21 and 31.
	SPI0-MOSI  10 and 38.
*/
