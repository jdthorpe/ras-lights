import React, { useState, useCallback, useContext } from 'react';
import { integer_input, range_input } from "shared/types/parameters"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { EditorContext } from '../editor';

const styles: Partial<ITextFieldStyles> = { fieldGroup: { width: "5rem" } };

export const is_int = /^\d+$/;
export const is_number = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

interface props {
    spec: integer_input | range_input;
    value: number;
    path: number[];
}

export const NumberOptions: React.FC<props> = ({ spec, value, path }) => {

    const [_value, set_value] = useState<string | undefined>(value.toString())
    const { type, label, min, max } = spec;
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const editor = useContext(EditorContext);

    const onChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

        set_value(newValue)

        if (typeof newValue === "undefined") {
            editor.update_value({ value: min }, path)
            setErrorMessage(`Required`)
            return;
        }

        if (type === "integer" && !is_int.test(newValue))
            return setErrorMessage(`Value must be an integer`)

        if (type === "number" && !is_number.test(newValue))
            return setErrorMessage(`Value must be a number`)

        if (+newValue < min)
            return setErrorMessage(`Value must be at least ${min}`)

        if (+newValue > max)
            return setErrorMessage(`Value must be at most ${max}`)

        //setValue(newValue);
        editor.update_value({ value: +newValue }, path)
        setErrorMessage(undefined)
    }, [min, max, type, editor, path])

    return (
        <div style={{ display: 'inline-block', margin: ".5rem" }}>
            <TextField
                label={label}
                value={_value}
                onChange={onChange}
                styles={styles}
                errorMessage={errorMessage}
            />
        </div >
    )
}

export const NumberValue = NumberOptions;
