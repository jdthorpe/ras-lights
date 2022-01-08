
import React, { useCallback, useContext } from 'react';
import { boolean_input } from "@ras-lights/common/types/parameters";
import { Toggle } from '@fluentui/react/lib/Toggle';
import { EditorContext } from '../editor'; //, pathEquals 

interface props {
    spec: boolean_input;
    value: boolean;
    path: number[];
}

export const BooleanOptions: React.FC<props> = ({ spec, value, path }) => {

    const editor = useContext(EditorContext);

    const onChange = useCallback((val: boolean) => {
        editor.set_value({ type: "boolean", value: val }, path) // , trigger_label
    }, [editor]) // , trigger_label // setChecked, 

    return (
        <>
            <Toggle
                label={spec.label}
                checked={value}
                onChanged={onChange}
            />
        </>

    )
}

export const BooleanValue = BooleanOptions