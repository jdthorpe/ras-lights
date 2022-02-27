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

export interface general_settings {
    delay_ms: number;
    series: boolean;
    leds?: number;
    tabs: surface_tabs;
}

export interface surface_tabs {
    phone: tab_lookup;
    tablet: tab_lookup;
    computer: tab_lookup;
}

export type surface = keyof surface_tabs;
export type tab_name = keyof tab_lookup;

interface tab_lookup {
    manual: boolean;
    modes: boolean;
    editor: boolean;
    schedule: boolean;
    template: boolean;
    admin: boolean;
    docs: boolean;
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
