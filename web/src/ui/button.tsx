import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { button_value } from '@ras-lights/common/types/mode';

export const Button: React.FC<{ value: button_value }> = ({ value }) => {

    return (
        <DefaultButton onClick={() => alert(value.ui.label)}>{
            value.ui.label
        }</DefaultButton >
    )
}
