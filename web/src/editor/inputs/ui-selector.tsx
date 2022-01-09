import React, { useState, useEffect, useCallback } from 'react';
import { ui_type, ui, ui_slider } from "@ras-lights/common/types/user-input";
import { num_value, value_instance } from '@ras-lights/common/types/mode';
import { input, integer_input } from '@ras-lights/common/types/parameters';
// import { Slider } from '@fluentui/react';
import { SliderConfig, default_slider_config } from '../../ui/slider';

// import { value } from '@ras-lights/common/types/parameters';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import equal from "fast-deep-equal"

const textboxStyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "15rem" } };
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "10rem" },
};


const NoneOption: IDropdownOption = { key: "none", text: "None" }
function get_ui_options(el: value_instance): IDropdownOption[] {
    switch (el.type) {
        case "boolean":
            return [
                NoneOption,
                { key: "toggle", text: "Toggle" },
            ]
        case "integer":
        case "number":
            return [
                NoneOption,
                { key: "slider", text: "Slider" },
            ]
        case "rgb":
            return [
                NoneOption,
                { key: "color-picker", text: "Color Picker" },
            ]
        case "rgb[]":
            return [
                NoneOption,
                { key: "color[]-picker", text: "Color Picker" },
            ]
        case "button":
            return [
                { key: "button", text: "Button" },
            ]
        default:
            const checker: never = el
            console.log("something went wrong with checker get_ui_options()", el)
            return []
    }

}


function makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

interface props {
    el: value_instance;
    spec: input;
    onChange: (ui: ui | undefined) => void;
}


const Selector: React.FC<props> = ({ el, spec, onChange }) => {

    const [_el, set_el] = useState<value_instance>()
    const [_spec, set_spec] = useState<input>()
    const [dropdown_key, set_dropdown_key] = useState<ui_type | "none">(el.ui?.type || "none")
    const [key, _set_key] = useState<string>(() => (el.ui?.key || makeid(8)))
    const [_label, _set_label] = useState<string>(el.ui?.label || spec?.label || "")
    const [_options, set_options] = useState<IDropdownOption[]>([])
    // still not extensible...
    const [slider_options, set_slider_options] = useState<Partial<ui_slider>>()

    useEffect(() => {
        if (typeof el === "undefined" || typeof spec === "undefined")
            return
        if (el !== _el || spec !== _spec) {
            console.log("Updating from the << OUTSIDE >>")
            set_el(el)
            set_spec(spec)
            set_options(get_ui_options(el))
            set_slider_options(default_slider_config(spec, el))

            _set_label((el.ui && el.ui.label) || spec?.label || "")
            set_dropdown_key((el.ui && el.ui.type) || "none")
        } else {
            console.log("Updating from the >> INSIDE <<")

            const val = (
                dropdown_key === "none" ?
                    undefined :
                    {
                        type: dropdown_key,
                        label: _label,
                        key,
                        ...slider_options
                    }
            )
            if (!equal(val, el.ui))
                onChange(val)
        }
    }, [el, spec, _el, _spec, dropdown_key, _label, key, slider_options])


    return (
        <>
            <Dropdown
                label="UI Element"
                placeholder="Select UI type"
                options={_options}
                styles={dropdownStyles}
                selectedKey={dropdown_key}
                onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    option?: IDropdownOption, index?: number
                ) => {
                    if (option) {
                        console.log("updating optoins")
                        set_dropdown_key(option.key as ui_type)
                    } else {
                        console.log("NOT updating optoins")
                    }
                }
                }
            />
            {el.ui &&
                <>
                    <TextField
                        label="Label"
                        value={el.ui.label || ""}
                        onChange={(
                            event: any,
                            newValue?: string | undefined
                        ) => _set_label(newValue || "")}
                        styles={textboxStyle}
                    />
                    <TextField
                        label="Key"
                        value={el.ui.key || ""}
                        onChange={(
                            event: any,
                            newValue?: string | undefined
                        ) => _set_key(newValue || "")}
                        styles={textboxStyle}
                    />
                </>
            }

            {el.ui && el.ui.type === "slider" &&
                <SliderConfig
                    el={el as num_value}
                    spec={spec as integer_input}
                    onChange={set_slider_options} />
            }
        </>

    )
}

export default Selector
