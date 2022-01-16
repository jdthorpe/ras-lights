import { value_instance } from "./mode";
import { rgb } from "./mode";

export type ui_type =
    | "button"
    | "toggle"
    | "slider"
    // | "dropdown"
    | "color-picker"
    | "color[]-picker";

export interface generic_ui {
    type: ui_type;
    label: string;
    key: string;
    path: number[];
}

export interface ui_rgb_array extends generic_ui {
    default: rgb[];
}
export interface ui_rgb extends generic_ui {
    default: rgb;
}

export interface ui_toggle extends generic_ui {
    default: boolean;
}

export interface ui_slider extends generic_ui {
    default: number;
    min: number;
    max: number;
}

export type ui = generic_ui | ui_slider | ui_toggle;

// export interface ui_data {
//     el: value_instance;
//     ui: ui;
//     path: number[];
// }
