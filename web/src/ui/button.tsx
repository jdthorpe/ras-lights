import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
// import { button_value } from '@ras-lights/common/types/mode';
import { generic_ui } from '@ras-lights/common/types/user-input';
import { set_update } from "./utils"

export const Button: React.FC<{ ui: generic_ui }> = ({ ui }) => (
    <DefaultButton onClick={() => set_update(ui.key, true)}>{
        ui.label
    }</DefaultButton >
)
