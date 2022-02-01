
import React, { useCallback, useContext } from 'react';
import { boolean_input } from "shared/types/parameters";
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
        editor.update_value({ value: val }, path)
    }, [editor])

    return <Toggle
        label={spec.label}
        checked={value}
        onChanged={onChange}
    />
}

export const BooleanValue = BooleanOptions