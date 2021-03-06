import React, { useState, useEffect, useCallback, useRef } from "react"
import styled from "styled-components"
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Label } from '@fluentui/react/lib/Label';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { rgb, rgbw } from "shared/types/mode"
import { value, input } from 'shared/types/parameters';
import { Color, ColorArray } from "../editor/inputs/color-input";
import { is_int, is_number } from "../editor/inputs/number-input";
import { IconButton } from "../utils/icon-button";
import { check } from "reserved-words";

import { faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const VALUE_LABELS: Record<value, string> = {
    "button": "Button",
    "boolean": "Boolean",
    "integer": "Integer",
    "number": "Number",
    "rgb": "Color",
    "rgbw": "RGB+W",
    "rgb[]": "Color Array",
    "rgbw[]": "RGB+W Array",
    "number[]": "W Array",
}
const VALUE_TYPES: value[] = Object.keys(VALUE_LABELS) as value[]
const VALUE_ITEMS = VALUE_TYPES.map(t => ({ key: t, text: VALUE_LABELS[t] }))

const descriptionTextBoxstyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "10rem" } };
const keyTextBoxstyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "6rem" } };
const numberTextBoxstyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "3rem" } };

const Row = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    gap: 10px;
    padding: 0 10px 10px 10px;
`
const Offset = styled.div`
    padding-top: 1.4rem;
    align-self: center;
`

const is_js_identifier = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;

interface cb {
    onChange: (x: input) => void;
    onRemove: () => void;
    onActivate?: () => void;
    onUp?: () => void;
    onDown?: () => void;
}
interface props extends cb {
    input: input;// | undefined;
}

const InputPicker: React.FC<props> = ({ input, onChange, onRemove, onActivate, onUp, onDown }) => {

    const [_input, set_input] = useState<input | undefined>(input);

    const [type, set_value_type] = useState<value | "button">(input ? input.type : "rgb");
    const [key, set_key] = useState<string>(input ? input.key : "");
    const [key_error, set_key_error] = useState<string | undefined>("");
    const [label, set_label] = useState<string>(input ? input.label : "");

    // DEFAULT VALUES
    const [bool, set_bool] = useState<boolean>(false);
    const [color, set_color] = useState<rgb>((input && input.type === "rgb") ? input.default : [0, 0, 255]);
    const [color_array, set_color_array] = useState<rgb[]>([[0, 0, 255], [0, 255, 255], [100, 0, 255],]);
    // const [rgbw, set_rgbw] = useState<rgbw>([0, 0, 255, 127]);
    // const [rgbw_array, set_rgbw_array] = useState<rgbw[]>([[0, 0, 255, 0], [0, 255, 255, 127], [100, 0, 255, 255],]);
    // const [w_array, set_w_array] = useState<number[]>([0, 63, 127, 191, 255]);
    const [button_label, set_button_label] = useState<string>("My Button");
    const [number, set_number] = useState<string>("5");
    const [min, set_min] = useState<string>("1");
    const [max, set_max] = useState<string>("10");
    // since there aren't pickers for these, we don't need setters
    const [rgbw] = useState<rgbw>([0, 0, 255, 127]);
    const [rgbw_array] = useState<rgbw[]>([[0, 0, 255, 0], [0, 255, 255, 127], [100, 0, 255, 255],]);
    const [w_array] = useState<number[]>([0, 63, 127, 191, 255]);

    const cb = useRef<cb>({ onChange, onRemove, onActivate, onUp, onDown })
    cb.current = { onChange, onRemove, onActivate, onUp, onDown }

    // useEffect(() => console.log("[A]input did change"), [input])
    // useEffect(() => console.log("[A]_input did change"), [_input])

    useEffect(() => {
        /* respond to changes from the outside world */
        if (input === _input)
            return
        if (typeof input === "undefined")
            return

        set_key(input.key)
        set_value_type(input.type)
        set_label(input.label)

        switch (input.type) {
            case "boolean":
                set_bool(input.default)
                break
            case "rgb":
                set_color(input.default)
                break
            case "rgb[]":
                set_color_array(input.default)
                break
            case "number[]":
            case "rgbw":
            case "rgbw[]":
            case "button":
                break
            case "integer":
            case "number":
                set_number(input.default.toString())
                set_min(input.min.toString())
                set_max(input.max.toString())
                break
            default:
                const checker: never = input
                console.log(checker)
        }
    }, [input, _input])

    useEffect(() => {
        /* send updates to the outside world */
        let input: input | undefined;

        switch (type) {
            case "rgbw":
                input = { type, key, label, default: rgbw }
                break
            case "rgbw[]":
                input = { type, key, label, default: rgbw_array }
                break
            case "number[]":
                input = { type, key, label, default: w_array }

                break
            case "number":
            case "integer":
                if (!number || !min || !max)
                    break
                input = { type, key, label, default: +number, min: +min, max: +max }
                break

            case "boolean":
                if (typeof bool === "undefined")
                    break
                input = { type, key, label, default: bool }
                break
            case "button":
                input = { type, key, label, default: button_label }
                break
            case "rgb":
                input = { type, key, label, default: color }
                break
            case "rgb[]":
                input = { type, key, label, default: color_array }
                break
            default:
                const checker: never = type
                console.log(checker)

        }
        if (typeof input !== "undefined") {
            set_input(input)
            cb.current.onChange(input)
        }
    }, [type, key, label, bool, color, color_array, number, min, max, button_label, rgbw, rgbw_array, w_array])

    useEffect(() => {
        /* validation for the key field */
        if (typeof key === "undefined") {
            set_key_error(undefined)
            return
        }
        if (!key) {
            set_key_error("empty")
            return
        }
        if (!is_js_identifier.test(key)) {
            set_key_error("not a valid JS identifier")
            return
        }
        if (check(key, 6)) {
            set_key_error("reserved word")
            return
        }
        set_key_error(undefined)
    }, [key, set_key_error])

    return <Row onClick={onActivate}>
        <Dropdown
            placeholder="Select..."
            label="Input Type"
            options={VALUE_ITEMS}
            styles={{ dropdown: { width: 110 }, }}
            selectedKey={type}
            onChange={(event: React.FormEvent<HTMLDivElement>,
                option?: IDropdownOption, index?: number) => {
                option && set_value_type(option.key as value)
            }}
        />
        <TextField
            label="Input Label"
            value={label}
            onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => set_label(newValue || "")}
            styles={descriptionTextBoxstyle} />
        <TextField
            label="Key"
            value={key}
            onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => set_key(newValue || "")}
            styles={keyTextBoxstyle}
            errorMessage={key_error} />

        {type && type === "rgb" && (<div>
            <Label>Default</Label>
            <Color color={color} />
        </div>)}
        {type && type === "rgb[]" && <div>
            <Label>Default</Label>
            <ColorArray colors={color_array} />
        </div>}
        {type && type === "boolean" &&
            <Toggle
                label="Default"
                checked={bool}
                onChange={(ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
                    typeof checked !== "undefined" && set_bool(checked)
                }} />
        }
        {type && type === "button" &&
            <TextField
                label="Button Label"
                value={button_label}
                onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => newValue && set_button_label(newValue)}
                styles={keyTextBoxstyle}
                errorMessage={key_error} />
        }
        {(type === "integer" || type === "number") && <>
            <NumField
                label="Default"
                value={number}
                set_value={set_number}
                type={type}
                styles={numberTextBoxstyle} />
            <NumField
                label="Minimum"
                value={min}
                max={typeof max === "undefined" ? max : +max}
                set_value={set_min}
                type={type}
                styles={numberTextBoxstyle} />
            <NumField
                label="Maximum"
                value={max}
                min={typeof min === "undefined" ? min : +min}
                set_value={set_max}
                type={type}
                styles={numberTextBoxstyle} />
        </>}
        <Offset style={{ marginLeft: "auto" }}>
            < IconButton
                title="Move Up"
                icon={faChevronUp}
                onClick={cb.current.onUp} />
        </Offset>
        <Offset>
            < IconButton
                title="Move Down"
                icon={faChevronDown}
                onClick={cb.current.onDown} />
        </Offset>
        <Offset>
            < IconButton
                title="Remove Input"
                icon={faTimes}
                onClick={cb.current.onRemove} />
        </Offset>
    </Row>
}

interface numProps {
    label: string;
    value: string | undefined;
    set_value: (x: string) => void;
    styles?: Partial<ITextFieldStyles>;
    type: "number" | "integer";
    min?: number;
    max?: number;
}

const NumField: React.FC<numProps> = ({ label, value, set_value, styles, type, min, max }) => {

    const [error, set_error] = useState<string | undefined>()

    const cb = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        typeof newValue !== "undefined" && set_value(newValue)
    }, [set_value])

    useEffect(() => {
        if (typeof value === "undefined") {
            set_error(undefined)
            return
        }
        if (!value) {
            set_error("empty")
            return
        }
        if (type === "number" && !is_number.test(value)) {
            set_error("not a number")
            return
        }
        if (type === "integer" && !is_int.test(value)) {
            set_error("not an integer")
            return
        }
        if (typeof min !== "undefined" && min > +value) {
            set_error(`minimum: ${min}`)
            return
        }
        if (typeof max !== "undefined" && max < +value) {
            set_error(`maximum: ${max}`)
            return
        }
        set_error(undefined)
    }, [value, set_error, type, min, max])

    return <TextField
        label={label}
        value={value}
        onChange={cb}
        styles={styles}
        errorMessage={error} />

}

export default InputPicker