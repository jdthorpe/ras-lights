import React from 'react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Label } from '@fluentui/react/lib/Label';
import { bool_value } from '@ras-lights/common/types/mode';

export const Button: React.FC<{ value: bool_value }> = ({ value }) => {

    return (
        <>
            <Label>{value.ui!.label}</Label>
            <Toggle onChange={(ev, checked?: boolean) => alert(checked)} />
        </>
    )
}