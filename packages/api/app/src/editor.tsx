import React, { useState, useEffect } from 'react';
import styled from "styled-components"
import { Label } from '@fluentui/react/lib/Label';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { NumberInput } from './editor/inputs/number-input';
import { input, color_input, integer_input, range_input } from "./data-types"
import { rgb, ColorValue, ColorInput, ColorArrayValue, ColorArrayInput } from './editor/inputs/color-input';


const Wrapper = styled.div`
    margin: 1rem;
`

const int_spec: integer_input = {
    label: "Integer",
    key: "Integer",
    type: "integer",
    default: 0,
    min: 0,
    max: 10,
}
const num_spec: range_input = {
    label: "Number",
    key: "Number",
    type: "number",
    default: 0,
    min: 0,
    max: 1,
}
const color_value_spec: color_input = {
    label: "Color Value",
    key: "a",
    type: "rgb"
}
const color_spec: color_input = {
    label: "Color Value Input",
    key: "a",
    type: "rgb"
}

interface editorProps {
    name: string;

}

const Editor: React.FC<editorProps> = ({ name }) => {

    const [defn, set_defn] = useState()

    useEffect(() => {




    }, [name])

    const [num, set_num] = useState(0)
    const [int, set_int] = useState(0)
    const [rgb, set_rgb] = useState<rgb>([0, 100, 255])
    const [rgb_array, set_rgb_array] = useState<rgb[]>([[0, 100, 255], [0, 100, 255]])

    return (<Wrapper>
        <Label>hi</Label>
        <NumberInput
            spec={int_spec}
            value={int}
            set={set_int} />
        <NumberInput
            spec={num_spec}
            value={num}
            set={set_num} />
        <ColorValue
            value={rgb}
            spec={color_value_spec} />
        <ColorInput
            value={rgb}
            spec={color_spec}
            set={set_rgb} />
        <ColorArrayValue
            value={rgb_array}
            spec={color_value_spec} />
        <ColorArrayInput
            value={rgb_array}
            spec={color_spec}
            set={set_rgb_array} />

    </Wrapper>)
};


export const ConstantValue: React.FC<{ input: input, set: { (x: any): void } }> = (props) => {

    const { type, label } = props.input; // , key

    return (<div>
        <Label>{label}</Label>
        {type === "boolean" && <Toggle
            label={label} onText="Yes" offText="No" onChanged={props.set}
        />}
        {type === "integer"}
        {type === "number"}
        {type === "rgb"}
        {type === "rgb[]"}
    </div>)
}

export default Editor