
import React, { useState, useCallback, useContext } from 'react';
import { boolean_input } from "@ras-lights/common/types/parameters";
import { Toggle } from '@fluentui/react/lib/Toggle';
import { EditorContext, pathEquals } from '../editor';


interface props {
    spec: boolean_input;
    // onChanged: { (x: any): void };
    value: boolean;
    path: number[];
    // activate?: () => void;
}

export const BooleanInput: React.FC<props> = ({ spec, value, path }) => {

    const [checked, setChecked] = useState(value)
    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    const onChange = useCallback((val: boolean) => {
        setChecked(val);
        editor.set_value({ type: "boolean", value: val }, path)
    }, [setChecked, editor])

    return (
        <div
            style={{ backgroundColor: is_active ? "#cccccc" : "tranparent" }}
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                ev.preventDefault()
                ev.stopPropagation()
                editor.set_active_path(path)
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
