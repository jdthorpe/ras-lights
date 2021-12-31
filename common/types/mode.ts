export type mode_param =
    | func_config
    | num_value
    | int_value
    | rgb_value
    | hex_value
    | hex_array_value
    | rgb_array_value
    | bool_value;

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

export interface num_value {
    type: "number";
    value: number;
}
export interface int_value {
    type: "integer";
    value: number;
}

export interface hex_value {
    type: "hex";
    value: string;
}
export interface hex_array_value {
    type: "hex[]";
    value: string[];
}

export interface rgb_value {
    type: "rgb";
    value: rgb;
}

export interface rgb_array_value {
    type: "rgb[]";
    value: rgb[];
}

export interface bool_value {
    type: "boolean";
    value: boolean;
}
