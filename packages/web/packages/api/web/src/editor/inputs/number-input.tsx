
import React, { useState, useCallback } from 'react';
import { integer_input, range_input } from "../../data-types"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';


const styles: Partial<ITextFieldStyles> = { fieldGroup: { width: "3rem" } };

const is_int = /^\d+$/;
const is_number = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

interface props {
    spec: integer_input | range_input;
    set: { (x: any): void };
    value: number;
}

export const NumberInput: React.FC<props> = (props) => {

    const { type, label, min, max } = props.spec;
    const [value, setValue] = useState(props.value.toString())
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
        setErrorMessage(undefined)
    }, [min, max, type])

    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            styles={styles}
            errorMessage={errorMessage}
        />
    )
}

export const NumberValue = NumberInput;
