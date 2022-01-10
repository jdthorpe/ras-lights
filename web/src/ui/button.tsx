import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
// import { button_value } from '@ras-lights/common/types/mode';
import { generic_ui } from '@ras-lights/common/types/user-input';

export const Button: React.FC<{ ui: generic_ui }> = ({ ui }) => {

    return (
        <DefaultButton onClick={() => alert(ui.label)}>{
            ui.label
        }</DefaultButton >
    )
}
