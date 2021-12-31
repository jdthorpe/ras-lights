import React, { useState, useCallback, useEffect } from 'react';
import styled from "styled-components"
import cc from "color-convert"
import copy from "fast-copy";

// font awesome 
// <i class="fas fa-gift"></i>

import { func_config, mode_param, rgb_array_value, rgb, mode } from "@ras-lights/common/types/mode";
import {
    value, signature, signatures, input,
    color_array_input, color_input,
    range_input, integer_input, boolean_input
} from "@ras-lights/common/types/parameters"
import { FuncValue } from './inputs/func-input';
import { ColorArray, ColorInput, ColorArrayInput, ColorValue } from './inputs/color-input';
import { BooleanInput } from './inputs/boolean-input';
import { NumberInput } from './inputs/number-input';
import { Dropdown, IDropdownOption } from '@fluentui/react';

import { make_loop, ILoop } from "./loop"

const Wrapper = styled.div`
    margin: 1rem;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`
const Main = styled.div`
    padding: 1rem;
    flex-grow: 1;
`
const Options = styled.div`
    min-width: 30rem;
    max-width: 30rem;
    background-color: #cccccc;
    padding: .8rem;
`

export interface descriptor_menu {
    [key: string]: { name: string, in: input[] }[]
}

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

function get_preview_at_path(
    mode: mode,
    item: mode_param,
    path: number[],
    signatures: signatures): [number | boolean | rgb | rgb[], input] {

    if (item.type !== "func")
        throw "invalid item type"

    let input: input
    let _path = path.slice(0, -1)

    while (_path.length) {
        if (typeof mode !== "function") {
            console.log("invalid path (2)")
            throw new Error("invalid path (2)")
        }
        if (item.type !== "func") {
            throw new Error("This should never happen (the previous error should have taken care of it)")
        }
        let i: number = _path.shift()!
        input = signatures[item.name].input[i]
        item = item.params[input.key]
        mode = Object.getOwnPropertyDescriptor(mode.__args__, input.key)!.get! as mode
    }

    if (item.type !== "func") {
        console.log("invalid path (3)", path, item)
        throw new Error("invalid path (3)")
    }
    input = signatures[item.name].input[path[path.length - 1]]
    return [mode.__args__[input.key], input]
}


function get_item_at_path(
    item: mode_param,
    path: number[],
    signatures: signatures): [mode_param, input | undefined] {

    path = [...path]
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
        // @ts-ignore no (simple) way to check this 
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
    const [colors, set_colors] = useState<rgb[]>()
    const [mode, set_mode] = useState<mode>()

    const [loop] = useState<ILoop>(() => make_loop(set_colors, { leds: 8 }))
    useEffect(() => {
        return function cleanup() {
            console.log("cleaning up")
            loop.stop()
        };
    }, []);

    const [active_item, active_input] = get_item_at_path(show, active_path, signatures)

    // A list of functions whose outputs are the same as the current item type
    const value_type: value = active_item.type === "func" ? signatures[active_item.name].output : active_item.type as value;
    const generators: string[] = Object.entries(signatures).filter(e => e[1].output === value_type).map(e => e[0]).sort()

    const get_preview = useCallback((props: { path: number[] }) => {

        if (props.path.length == 0)
            // return (<p>Nothing to preview {JSON.stringify(props.path)}</p>)
            return typeof colors === "undefined" ? (<p>too early</p>) : (<ColorArray colors={colors} />)
        // if (props.path.length == 1)
        //     return typeof colors === "undefined" ? (<p>too early</p>) : (<ColorArray colors={colors} />)

        const [data, input] = get_preview_at_path(mode!, show, props.path, signatures)
        switch (input.type) {
            case "boolean":
            case "number":
            case "integer": {
                return (<p>{data}</p>)
            }
            case "rgb": { return <ColorArray colors={[data as rgb]} /> }
            case "rgb[]": { return <ColorArray colors={data as rgb[]} /> }
            default: {
                // @ts-ignore
                return (<p>Unknown input type {input.type}</p>)
            }


        }
    }, [mode, signatures, show, colors])

    const set = useCallback((
        new_value: mode_param,
        path: number[],
    ) => {
        if (path.length === 0) {
            // special case
            set_show(new_value as rgb_array_value | func_config)
            set_active_path([])

            if (new_value.type === "func") {
                // console.log("re-building")
                const mode = loop.start(new_value)
                // console.log("........ loop start returned", typeof mode, Array.isArray(mode))
                set_mode(() => mode)
            } else {
                loop.stop()
            }
            return
        }

        let old_value: mode_param = get_item_at_path(show, path, signatures)[0]
        // console.log("set old_value: ", old_value)

        // error checking
        let old_type = old_value.type === "func" ? signatures[old_value.name].output : old_value.type
        let new_type = new_value.type === "func" ? signatures[new_value.name].output : new_value.type
        if (old_type !== new_type)
            throw new Error(`type of previous value (${old_type}) is not compatible with new value (${new_type})`)

        // update the show
        let new_show = copy(show)
        let parent: func_config = get_item_at_path(new_show, path.slice(0, path.length - 1), signatures)[0] as func_config
        parent.params[signatures[parent.name].input[path[path.length - 1]].key] = new_value

        if (new_show.type === "func") {
            const mode = loop.start(new_show)
            set_mode(() => mode)
        } else {
            loop.stop()
        }
        set_show(new_show)
        set_active_path(path)

    }, [show, set_mode, active_path])


    const onDropdownChanged = (option: IDropdownOption) => {
        if (option.key === "constant") {
            if (active_path.length === 0) {
                set(default_show, [])
            } else {
                // (active_input is only undefined when path.length === 0)
                set({
                    type: active_input!.type,
                    // @ts-ignore no (simple) way to check this 
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
            {/* <div>
                <pre>
                    {JSON.stringify(show, null, 4)}
                </pre>
                {JSON.stringify(active_path)}
            </div> */}
            <Main>
                {JSON.stringify(active_path)}
                {show.type === "func" ? (
                    <div>
                        <FuncValue
                            config={show}
                            path={[]}
                            signatures={signatures}
                            activate={set_active_path}
                            Preview={get_preview}
                        />
                    </div>
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
                    <div>
                        {JSON.stringify(active_path)}

                        <NumberInput
                            value={active_item.value}
                            spec={active_input as range_input | integer_input}
                            onChanged={function (value) {
                                // console.log("updating:", active_input?.label)
                                // console.log(">> active path", active_path)
                                set({ type: active_item.type, value }, active_path)
                            }} />
                    </div>
                )}
                {active_item.type === "rgb" && (
                    <ColorInput
                        value={active_item.value}
                        spec={active_input as color_input}
                        onChanged={(value) => {
                            // console.log("calling set", value, active_path)
                            set({ type: "rgb", value }, active_path)
                        }} />
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