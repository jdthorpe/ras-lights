import React from 'react';
import { Color, ColorArray } from '../editor/inputs/color-input';
import { Label } from '@fluentui/react/lib/Label';
import { rgb_value, rgb_array_value } from '@ras-lights/common/types/mode';

export const ColorInput: React.FC<{ value: rgb_value }> = ({ value }) => {

    return (
        <>
            <Label>{value.ui!.label}</Label>
            <Color color={value.value} />
        </>
    )
}

export const ColorArrayInput: React.FC<{ value: rgb_array_value }> = ({ value }) => {

    return (
        <>
            <Label>{value.ui!.label}</Label>
            <ColorArray colors={value.value} />
        </>
    )
}
