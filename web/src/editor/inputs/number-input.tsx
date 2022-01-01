import React, { useState, useCallback, useContext, useEffect } from 'react';
import { integer_input, range_input } from "@ras-lights/common/types/parameters"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { EditorContext, pathEquals } from '../editor';

const styles: Partial<ITextFieldStyles> = { fieldGroup: { width: "5rem" } };

const is_int = /^\d+$/;
const is_number = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

interface props {
    spec: integer_input | range_input;
    //onChanged: { (x: any): void };
    value: number;
    path: number[];
    //activate?: () => void;
}

export const NumberInput: React.FC<props> = ({ spec, value, path }) => {

    const { type, label, min, max } = spec;
    // const [s_value, setValue] = useState(value.toString())
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    useEffect(() => {
        // error messages should only stick around for 5 seconds (since the bad
        // values aren't kept anyway)
        if (typeof errorMessage === "undefined")
            return
        const timeout = setTimeout(() => setErrorMessage(undefined), 5e3) // TODO: magic number
        return () => {
            clearTimeout(timeout)
        }
    }, [errorMessage])

    const onChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

        if (typeof newValue === "undefined") {
            //setValue('');
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

        //setValue(newValue);
        editor.set_value({ type, value: +newValue }, path)
        setErrorMessage(undefined)
    }, [min, max, type, editor])

    return (
        <div
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                ev.preventDefault()
                ev.stopPropagation()
                editor.set_active_path(path)
            }}
            style={{
                backgroundColor: is_active ? "#cccccc" : "transparent",
                display: 'inline-block',
                margin: ".5rem"
            }}>
            <TextField
                label={label}
                value={`${value}`}
                onChange={onChange}
                styles={styles}
                errorMessage={errorMessage}
            />
        </div >
    )
}

export const NumberValue = NumberInput;
