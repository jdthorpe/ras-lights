import React from 'react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { ui_toggle } from 'shared/types/user-input';
import { set_update } from "./utils"

export const ToggleInput: React.FC<{ ui: ui_toggle }> = ({ ui }) => (
    <Toggle
        label={ui.label}
        onChange={(ev, checked?: boolean) => {
            if (typeof checked !== "undefined") set_update(ui.key, checked)
        }} />
)