import React from 'react';
import { button_input } from "shared/types/parameters";
import { button_value } from 'shared/types/mode';
import { Label } from '@fluentui/react/lib/Label';
import { DefaultButton } from '@fluentui/react/lib/Button';

interface props {
    spec: button_input;
    value: button_value;
}
export const ButtonValue: React.FC<props> = ({ spec, value }) => {
    return (<>
        <Label>{spec.label}</Label>
        <DefaultButton>{value.ui.label}</DefaultButton>
    </>)
}

