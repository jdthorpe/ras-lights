import React from 'react';
import { Button } from "./button";
import { ToggleInput } from "./toggle"
import { SliderInput } from "./slider";
import { ColorArrayInput, ColorInput } from "./color";
import { ui, ui_type, ui_rgb, ui_rgb_array, ui_slider, ui_toggle } from '@ras-lights/common/types/user-input';
// import { bool_value, button_value, num_value, rgb_array_value, rgb_value } from '@ras-lights/common/types/mode';

export const UI_instance: React.FC<{ ui: ui }> = ({ ui }) => {
    const type: ui_type = ui.type

    switch (type) {
        case "button":
            return <Button ui={ui} />
        case "color-picker":
            return <ColorInput ui={ui as ui_rgb} />
        case "color[]-picker":
            return <ColorArrayInput ui={ui as ui_rgb_array} />
        case "slider":
            return <SliderInput ui={ui as ui_slider} />
        case "toggle":
            return <ToggleInput ui={ui as ui_toggle} />
        default:
            const checker: never = type
            console.log(checker)
            return <p>Unknown ui type "{type}"</p>
    }
}
