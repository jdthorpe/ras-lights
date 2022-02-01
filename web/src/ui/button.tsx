import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { generic_ui } from 'shared/types/user-input';
import { set_update } from "./utils"

export const Button: React.FC<{ ui: generic_ui }> = ({ ui }) => (
    <DefaultButton onClick={() => set_update(ui.key, true)}>{
        ui.label
    }</DefaultButton >
)
