import React, { useState, useEffect } from "react"
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { value } from "shared/types/parameters"

const VALUE_TYPES: value[] = ["boolean", "integer", "number", "number[]", "rgb", "rgb[]", "rgbw[]"]
const VALUE_LABELS: { [key: string]: string } = {
    "button": "Button",
    "boolean": "Boolean",
    "integer": "Integer",
    "number": "Number",
    "number[]": "W Array",
    "rgb": "Color",
    "rgb[]": "Color Array",
    "rgbw[]": "RGB+W Array",
}
const VALUE_ITEMS = VALUE_TYPES.map(t => ({ key: t, text: VALUE_LABELS[t] }))

const valueDropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 110 },
};

interface ValuePickerProps {
    value?: value;
    onChange: (value: value) => void;
    placeholder?: string;
    label?: string;
}
const ValuePicker: React.FC<ValuePickerProps> = ({ value, onChange, placeholder, label }) => {
    const [_value, _set_value] = useState<value | undefined>(value || "rgb[]")
    useEffect(() => _set_value(value), [value])
    useEffect(() => {
        _value && onChange(_value)
    }, [onChange, _value])

    return <Dropdown
        placeholder={placeholder || "Select..."}
        label={label}
        options={VALUE_ITEMS}
        styles={valueDropdownStyles}
        selectedKey={_value}
        onChange={(event: React.FormEvent<HTMLDivElement>,
            option?: IDropdownOption) => {
            option && _set_value(option.key as value)
        }}
    />

}

export default ValuePicker