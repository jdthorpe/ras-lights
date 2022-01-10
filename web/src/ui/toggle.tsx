import React from 'react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Label } from '@fluentui/react/lib/Label';
// import { bool_value } from '@ras-lights/common/types/mode';
import { ui_toggle } from '@ras-lights/common/types/user-input';

export const ToggleInput: React.FC<{ ui: ui_toggle }> = ({ ui }) => {

    return (
        <>
            <Label>{ui.label}</Label>
            <Toggle onChange={(ev, checked?: boolean) => alert(checked)} />
        </>
    )
}