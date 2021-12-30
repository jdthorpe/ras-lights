import React, { useState, useCallback, useEffect } from 'react';
import styled from "styled-components"
import cc from "color-convert"
import copy from "fast-copy";

import { func_config, mode_param, rgb_array_value, rgb } from "common/types/mode";
import {
    value, signature, input,
    color_array_input, color_input,
    range_input, integer_input, boolean_input
} from "common/types/parameters"
import { FuncValue } from './editor/inputs/func-input';
import { ColorArray, ColorInput, ColorArrayInput } from './editor/inputs/color-input';
import { BooleanInput } from './editor/inputs/boolean-input';
import { NumberInput } from './editor/inputs/number-input';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { divide } from 'lodash';


const Wrapper = styled.div`
    margin: 1rem;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`
const Main = styled.div`
    flex-grow: 1;
`
const Options = styled.div`
    max-width: 30rem;
    background-color: #4287f5;
`

export interface descriptor_menu {
    [key: string]: { name: string, in: input[] }[]
}

/*

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
    const [signatures, set_signatures] = useState<descriptor_menu>()

    useEffect(() => {
        if (typeof signatures === "undefined")
            (async () => {
                try {
                    console.log("fetching")
                    const res = (await fetch("/api/registry/descriptors"));
                    console.log("jsoning")
                    const data: { [key: string]: signature } = await res.json()
                    console.log("sorting")
                    const temp: descriptor_menu = {}
                    for (let [name, val] of Object.entries(data)) {
                        let { in: input, out } = val
                        if (!(out in temp))
                            temp[out] = []
                        temp[out].push({ name, in: input })
                    }
                    console.log("labeling")
                    const descriptor_menu: descriptor_menu = {}
                    for (let [name, val] of Object.entries(temp)) {
                        descriptor_menu[name] = val.sort((a, b) => (a.name < b.name) ? 1 : -1)
                    }
                    console.log("setting")
                    set_signatures(descriptor_menu)
                } catch (err) {
                    console.log("erroring", err)

                }
            })()
    }, [signatures])

    const [num, set_num] = useState(0)
    const [int, set_int] = useState(0)
    const [rgb, set_rgb] = useState<rgb>([0, 100, 255])
    const [rgb_array, set_rgb_array] = useState<rgb[]>([[0, 100, 255], [0, 100, 255]])

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

*/

const rainbow: rgb[] = [0, 1, 2, 3, 4, 5].map(i => cc.rgb.hsv([60 * i, 100, 100,]))
const default_show: rgb_array_value = {
    type: "rgb[]",
    value: rainbow,
}

const default_spec: color_array_input = {
    label: "Pixel Colors",
    key: "nothing",
    type: "rgb[]",
    default: rainbow,
}

type signatures = { [key: string]: signature }

function get_item_at_path(
    item: mode_param,
    path: number[],
    signatures: signatures): [mode_param, input | undefined] {

    let input: input | undefined = undefined;
    while (path.length) {
        if (item.type !== "func")
            throw new Error("invalid path")
        let i: number = path.shift()!
        input = signatures[item.name].input[i]
        item = item.params[input.key]
    }
    return [item, input]
}

function build_fun(name: string, s: signature): func_config {
    return {
        type: "func",
        name,
        params: Object.fromEntries(
            s.input.map(o => [
                o.key,
                { type: o.type, value: o.default }
            ])
        )
    }
}

interface editorProps {
    name?: string;
    signatures: signatures
}

const Editor: React.FC<editorProps> = ({ signatures }) => {

    // path to the active element
    const [active_path, set_active_path] = useState<number[]>([])
    const [show, set_show] = useState<func_config | rgb_array_value>(default_show)

    const [active_item, active_input] = get_item_at_path(show, active_path, signatures)

    // fuctions list of functions whose outputs are the same as the current item type
    const value_type: value = active_item.type === "func" ? signatures[active_item.name].output : active_item.type as value;
    const generators: string[] = Object.entries(signatures).filter(e => e[1].output === value_type).map(e => e[0]).sort()

    const set = useCallback((
        new_value: mode_param,
        path: number[],
    ) => {
        if (path.length === 0) {
            // special case
            set_show(new_value as rgb_array_value | func_config)
            set_active_path([])
            return
        }

        let old_value: mode_param = get_item_at_path(show, path, signatures)[0]

        // error checking
        let old_type = old_value.type === "func" ? signatures[old_value.name].output : old_value.type
        let new_type = new_value.type === "func" ? signatures[new_value.name].output : new_value.type
        if (old_type !== new_type)
            return new Error(`type of previous value (${old_type}) is not compatible with new value (${new_type})`)

        // update the show
        let new_show = copy(show)
        let parent: func_config = get_item_at_path(new_show, path.slice(path.length - 1), signatures)[0] as func_config
        parent.params[signatures[parent.name].input[path[path.length - 1]].key] = new_value
        set_show(new_show)
        set_active_path(path)

    }, [show])


    const onDropdownChanged = (option: IDropdownOption) => {
        if (option.key === "constant") {
            if (active_path.length === 0) {
                set(default_show, [])
            } else {
                // (active_input is only undefined when path.length === 0)
                set({
                    type: active_input!.type,
                    value: active_input!.default
                }, active_path)
            }
        } else {
            const func = build_fun(option.key as string, signatures[option.key])
            set(func, active_path)
        }
    }

    return (
        <Container>
            <Main>
                {show.type === "func" ? (
                    <FuncValue
                        config={show}
                        path={[]}
                        signature={signatures[show.name]}
                        activate={set_active_path}
                    />
                ) : (<ColorArray colors={show.value} />)}
            </Main>
            <Options>

                {generators.length && <Dropdown
                    label="Input Type"
                    selectedKey={active_item.type === "func" ? active_item.name : "constant"}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChanged={onDropdownChanged}
                    placeholder="Select an option"
                    options={["constant", ...generators].map(s => ({ key: s, text: s }))}
                />}
                {active_item.type === "boolean" && (
                    <BooleanInput
                        value={active_item.value}
                        spec={active_input as boolean_input}
                        onChanged={(value) => set({ type: "boolean", value }, active_path)} />
                )}
                {(active_item.type === "number" || active_item.type === "integer") && (
                    <NumberInput
                        value={active_item.value}
                        spec={active_input as range_input | integer_input}
                        onChanged={(value) => set({ type: active_item.type, value }, active_path)} />
                )}
                {active_item.type === "rgb" && (
                    <ColorInput
                        value={active_item.value}
                        spec={active_input as color_input}
                        onChanged={(value) => set({ type: "rgb", value }, active_path)} />
                )}
                {active_item.type === "rgb[]" && (
                    <ColorArrayInput
                        value={active_item.value}
                        spec={active_path.length === 0 ? default_spec : (active_input as color_array_input)}
                        onChanged={(value) => set({ type: "rgb[]", value }, active_path)} />
                )}


            </Options>

        </Container>

    )
};

const EditorTab: React.FC = () => {

    const [signatures, set_signatures] = useState<signatures>()

    useEffect(() => {
        if (typeof signatures === "undefined")
            (async () => {
                try {
                    console.log("fetching")
                    const res = (await fetch("/api/registry/descriptors"));
                    console.log("jsoning")
                    const data: { [key: string]: signature } = await res.json()
                    set_signatures(data)
                } catch (err) {
                    console.log("erroring", err)
                }
            })()
    }, [signatures])

    if (typeof signatures === "undefined")
        return (<div><p>Loading...</p></div>)
    return (<Editor
        signatures={signatures}
    />)
}

export default EditorTab