import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { Slider } from '@fluentui/react/lib/Slider';
import { int_value, num_value } from '@ras-lights/common/types/mode';

export const SliderInput: React.FC<{ value: int_value | num_value }> = ({ value }) => {

    return (
        <>
            <Label>{value.ui!.label}</Label>
            <Slider
                min={value.ui!.min}
                max={value.ui!.max}
                step={value.type === "integer" ? value.ui!.min - value.ui!.max + 1 : undefined}
                defaultValue={value.value}
                // showValue 
                snapToStep={value.type === "integer"}
            />
        </>
    )
}
