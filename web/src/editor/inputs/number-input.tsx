import React, { useState, useCallback } from 'react';
import { integer_input, range_input } from "@ras-lights/common/types/parameters"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';


const styles: Partial<ITextFieldStyles> = { fieldGroup: { width: "5rem" } };

const is_int = /^\d+$/;
const is_number = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

interface props {
    spec: integer_input | range_input;
    onChanged: { (x: any): void };
    value: number;
    activate?: () => void;
}

export const NumberInput: React.FC<props> = ({ spec, value, onChanged, activate }) => {

    const { type, label, min, max } = spec;
    const [s_value, setValue] = useState(value.toString())
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const onChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

        if (typeof newValue === "undefined") {
            setValue('');
            return;
        }

        if (type === "integer" && !is_int.test(newValue)) {
            setErrorMessage(`Value must be an integer`)
            return
        }

        if (type === "number" && !is_number.test(newValue)) {
            setErrorMessage(`Value must be a number`)
            return
        }
        if (+newValue < min)
            setErrorMessage(`Value must be at least ${min}`)
        if (+newValue > max)
            setErrorMessage(`Value must be at most ${max}`)

        setValue(newValue);
        onChanged(+newValue)
        setErrorMessage(undefined)
    }, [min, max, type, onChanged])

    return (
        <div
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                if (typeof activate !== "undefined") {
                    ev.preventDefault()
                    ev.stopPropagation()
                    activate()
                }
            }}
            style={{
                display: 'inline-block',
                margin: ".5rem"
            }}>
            <TextField
                label={label}
                value={s_value}
                onChange={onChange}
                styles={styles}
                errorMessage={errorMessage}
            />
        </div >
    )
}

export const NumberValue = NumberInput;
