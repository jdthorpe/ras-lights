import React, { useEffect } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';

interface NumberProps {
    label: string;
    min?: number;
    max?: number;
    value?: number;
    onChange: { (x: number): void };
}

export const Number: React.FC<NumberProps> = ({ label, min, max, value, onChange }) => {

    const [_value, set_value] = React.useState(`${value}`);
    const [error, set_error] = React.useState<string | undefined>();

    useEffect(() => {
        set_value((typeof value === "undefined" || isNaN(value)) ? "" : `${value}`)
    }, [value])

    const _onChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            set_value(newValue || '');
            let val = newValue ? parseInt(newValue) : NaN
            onChange(val)
            if (newValue) {
                if (isNaN(val)) return set_error(`Not an integer`)
                if (typeof min === "number" && val < min) return set_error(`Minimum: ${min}`)
                else if (typeof max === "number" && val > max) return set_error(`Maximum: ${max}`)
                else set_error(undefined)
            }
        },
        [min, max, onChange]);

    return <TextField
        styles={{ root: { maxWidth: "5rem" } }}
        label={label}
        value={_value}
        onChange={_onChange}
        errorMessage={error}
    />
}
