import { value_instance } from "./mode";

export type ui_type =
    | "button"
    | "toggle"
    | "slider"
    // | "dropdown"
    | "color-picker"
    | "color[]-picker";

interface generic_ui {
    type: ui_type;
    label: string;
    key: string;
}

export interface ui_slider extends generic_ui {
    min: number;
    max: number;
}

export type ui = generic_ui | ui_slider;

export interface ui_data {
    el: value_instance;
    ui: ui;
    path: number[];
}
