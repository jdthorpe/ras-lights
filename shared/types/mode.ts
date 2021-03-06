/* Types in this file represent the data behind a show (mode)

    Specifically, this is everything required to specify a func_config
    instance
*/

import { value } from "./parameters";
import { ui, ui_slider, generic_ui } from "./user-input";

export type mode_param = func_config | value_instance;

export interface show {
    name: string;
    def: func_config | rgb_array_value;
    ui?: ui[];
}

export interface button_config {
    type: "button";
    label: string;
}

export interface func_config {
    type: "func";
    name: string;
    params: { [key: string]: mode_param };
}

export interface mode {
    (): rgb[];
    __args__: any;
}

export type rgb = [number, number, number];
export type rgbw = [number, number, number, number];
export type hsv = [number, number, number];

interface generic_value_instance {
    type: value;
    value: any;
    ui?: ui;
}

export interface num_value extends generic_value_instance {
    type: "number";
    value: number;
    ui?: ui_slider;
}

export interface num_array_value extends generic_value_instance {
    type: "number[]";
    value: number[];
}

export interface int_value extends generic_value_instance {
    type: "integer";
    value: number;
    ui?: ui_slider;
}

export interface rgbw_value extends generic_value_instance {
    type: "rgbw";
    value: rgbw;
    // ui?: "color-picker";
}

export interface num_array_value extends generic_value_instance {
    type: "number[]";
    value: number[];
}
export interface rgbw_array_value extends generic_value_instance {
    type: "rgbw[]";
    value: rgbw[];
}

export interface rgb_value extends generic_value_instance {
    type: "rgb";
    value: rgb;
    // ui?: "color-picker";
}

export interface rgb_array_value extends generic_value_instance {
    type: "rgb[]";
    value: rgb[];
    // ui?: "color[]-picker";
}

export interface bool_value extends generic_value_instance {
    type: "boolean";
    value: boolean;
    // ui?: "toggle";
}

interface button_ui extends generic_ui {
    type: "button";
}

export interface button_value extends generic_value_instance {
    type: "button";
    ui: button_ui;
}

export type value_instance =
    | button_value
    | bool_value
    | rgbw_array_value
    | num_array_value
    | rgb_array_value
    | rgb_value
    | rgbw_value
    | int_value
    | num_value;
