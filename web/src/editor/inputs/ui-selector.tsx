import React, { useState, useEffect } from 'react';
import { ui_type, ui } from "@ras-lights/common/types/user-input";
import { value_instance } from '@ras-lights/common/types/mode';
import { input, integer_input } from '@ras-lights/common/types/parameters';
import { Slider } from '@fluentui/react';

// import { value } from '@ras-lights/common/types/parameters';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';

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
            console.log(checker)
            return []
    }

}



interface props {
    el: value_instance;
    spec: input;
    onChange: (ui: ui | undefined) => void;
}

const Selector: React.FC<props> = ({ el, spec, onChange }) => {

    const [_key, set_key] = useState<ui_type | "none">("none")
    const [_label, _set_label] = useState<string>("")
    const [_type, _set_type] = useState<string>("")
    const [_options, set_options] = useState<IDropdownOption[]>([])

    useEffect(() => {
        // update whenever there is a new input element
        if (_type !== el.type) {
            _set_type(el.type)
            set_options(get_ui_options(el))
        }
        _set_label((el.ui && el.ui.label) || "")
        set_key((el.ui && el.ui.type) || "none")
    }, [el])

    useEffect(() => {
        // update whenever there is a new input element
        if (_key === "none") {
            onChange(undefined)
        } else {
            onChange({ type: _key, label: _label })
        }
    }, [_key, _label])

    // (el.ui && alert(JSON.stringify(el.ui)));

    return (
        <>
            <Dropdown
                label="UI Element"
                placeholder="Select UI type"
                options={_options}
                styles={dropdownStyles}
                selectedKey={_key}
                onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    option?: IDropdownOption, index?: number
                ) => option && set_key(option.key as ui_type)
                }
            />
            {el.ui &&
                <TextField
                    label="Label"
                    value={el.ui.label || ""}
                    onChange={(
                        event: any,
                        newValue?: string | undefined
                    ) => _set_label(newValue || "")}
                    styles={textboxStyle}
                />}
            {el.ui && el.ui.type === "slider" &&
                <Slider
                    ranged
                    label="Input Range"
                    min={(spec as integer_input).min}
                    max={(spec as integer_input).max}
                    defaultValue={(spec as integer_input).max}
                    defaultLowerValue={(spec as integer_input).min}
                />

            }


        </>

    )
}

export default Selector
