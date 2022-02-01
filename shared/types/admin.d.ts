export interface user_library {
    path: string;
    name: string;
}

export interface user_library_data extends user_library {
    type: "LIBRARY";
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
    reverse: boolean;
}
