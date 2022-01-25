/*
 This has the types that are used to describe the inputs (parameters) of a function
 */

export type value =
    | "boolean"
    | "integer"
    | "number"
    | "number[]"
    | "rgbw"
    | "rgbw[]"
    | "rgb"
    | "rgb[]"
    | "button";

import { rgb, rgbw } from "./mode";

export interface values {
    [key: string]: value;
}

interface generic_input {
    type: value;
    label: string;
    key: string;
    // default?: any; // This should be over ridden by concrete interfaces
}

export interface button_input extends generic_input {
    type: "button";
    default: string;
}

export interface boolean_input extends generic_input {
    type: "boolean";
    // value:
    default: boolean;
}

export interface integer_input extends generic_input {
    type: "integer";
    default: number;
    min: number;
    max: number;
}

export interface range_input extends generic_input {
    type: "number";
    default: number;
    min: number;
    max: number;
}

export interface rgbw_input extends generic_input {
    type: "rgbw";
    default: rgbw;
}

export interface rgbw_array_input extends generic_input {
    type: "rgbw[]";
    default: rgbw[];
}

export interface color_input extends generic_input {
    type: "rgb";
    default: rgb;
}

export interface color_array_input extends generic_input {
    type: "rgb[]";
    default: rgb[];
}

export type input =
    | boolean_input
    | button_input
    | integer_input
    | range_input
    | color_input
    | color_array_input;

export interface signature {
    input: input[];
    output: value; // | values;
}

export interface signatures {
    [key: string]: signature;
}
