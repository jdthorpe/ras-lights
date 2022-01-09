import React from 'react';
import { Button } from "./button";
import { ToggleInput } from "./toggle"
import { SliderInput } from "./slider";
import { ColorArrayInput, ColorInput } from "./color";
import { ui_data, ui_type } from '@ras-lights/common/types/user-input';
import { bool_value, button_value, num_value, rgb_array_value, rgb_value } from '@ras-lights/common/types/mode';

export const UI_instance: React.FC<{ value: ui_data }> = ({ value }) => {
    const { el, ui } = value;
    const type: ui_type = ui.type

    switch (type) {
        case "button":
            return <Button value={el as button_value} />
        case "color-picker":
            return <ColorInput value={el as rgb_value} />
        case "color[]-picker":
            return <ColorArrayInput value={el as rgb_array_value} />
        case "slider":
            return <SliderInput value={el as num_value} />
        case "toggle":
            return <ToggleInput value={el as bool_value} />
        default:
            const checker: never = type
            console.log(checker)
            return <p>Unknown ui type "{type}"</p>
    }
}
