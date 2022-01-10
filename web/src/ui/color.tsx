import React from 'react';
import { Color, ColorArray } from '../editor/inputs/color-input';
import { Label } from '@fluentui/react/lib/Label';
// import { rgb_value, rgb_array_value } from '@ras-lights/common/types/mode';
import { ui_rgb, ui_rgb_array } from '@ras-lights/common/types/user-input';

export const ColorInput: React.FC<{ ui: ui_rgb }> = ({ ui }) => {

    return (
        <>
            <Label>{ui!.label}</Label>
            <Color color={ui.default} />
        </>
    )
}

export const ColorArrayInput: React.FC<{ ui: ui_rgb_array }> = ({ ui }) => {

    return (
        <>
            <Label>{ui.label}</Label>
            <ColorArray colors={ui.default} />
        </>
    )
}
