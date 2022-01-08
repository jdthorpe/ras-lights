/* Types in this file represent the data behind a show (mode)

    Specifically, this is everything required to specificy a func_config
    instance
*/

import { value } from "./parameters";
import { ui, ui_slider } from "./user-input";

export type mode_param = func_config | value_instance;

export interface show {
    name: string;
    def: func_config | rgb_array_value;
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

export interface int_value extends generic_value_instance {
    type: "integer";
    value: number;
    ui?: ui_slider;
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

export interface button_value extends generic_value_instance {
    type: "button";
    ui: { type: "button"; label: string };
}

export type value_instance =
    | button_value
    | bool_value
    | rgb_array_value
    | rgb_value
    | int_value
    | num_value;
