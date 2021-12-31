
import React, { useState, useCallback } from 'react';
import { boolean_input } from "@ras-lights/common/types/parameters";
import { Toggle } from '@fluentui/react/lib/Toggle';


interface props {
    spec: boolean_input;
    onChanged: { (x: any): void };
    value: boolean;
    activate?: () => void;
}

export const BooleanInput: React.FC<props> = ({ spec, value, onChanged, activate }) => {

    const [checked, setChecked] = useState(value)
    const onChange = useCallback((val: boolean) => {
        setChecked(val);
        onChanged(val)
    }, [])

    return (
        <div onClick={(ev: React.MouseEvent<HTMLElement>) => {
            if (typeof activate !== "undefined") {
                ev.preventDefault()
                ev.stopPropagation()
                activate()
            }
        }}>
            <Toggle
                label={spec.label}
                checked={checked}
                onChanged={onChange}
            />
        </div>
    )
}

export const BooleanValue = BooleanInput;
