import React, { useRef, useState, useEffect, createContext, useCallback } from 'react';
import styled from "styled-components"
import cc from "color-convert"
import copy from "fast-copy";
import { IconButton } from '../utils/icon-button';
import { faCode, faHashtag, faBolt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { delete_mode, save_mode, fetch_modes } from "../utils/api"
import { Label } from '@fluentui/react/lib/Label';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import {
    ComboBox,
    IComboBoxOption,
    IComboBox,
    IComboBoxStyles,
} from '@fluentui/react/lib/ComboBox';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useBoolean } from '@fluentui/react-hooks';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

import { ui } from "shared/types/user-input";

import { func_config, mode_param, rgb_array_value, rgb, rgbw, mode, value_instance } from 'shared/types/mode';
import {
    value, signature, signatures, input,
    color_array_input, color_input,
    range_input, integer_input, boolean_input
} from "shared/types/parameters"
import { FuncValue } from './inputs/func-input';
import { WArray, ColorArray, ColorOptions, ColorArrayOptions } from './inputs/color-input';
import { RGBWArray, RGBW } from './inputs/rgbw-input';
import { BooleanOptions } from './inputs/boolean-input';
import { NumberOptions } from './inputs/number-input';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';

import UISelector from "./inputs/ui-selector"

import { load_remotes } from '../loader';
import { make_loop, ILoop } from "./loop"
import { UI } from '../ui';

const VALUE_NAMES: value[] = ["boolean", "number", "integer", "rgb", "rgb[]", "button"]
const ROOT_TYPES: value[] = ["rgb[]", "rgbw[]", "number[]"]
const ACTIVE_COLOR = "9be2fa"; //00c6fc
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
const dialogStyles = { main: { maxWidth: 450 } };
const dialogContentProps = {
    type: DialogType.normal,
    title: 'Are you sure?',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure you want to delete this mode?',
}

const Header = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    background-color: #cccccc;
    margin-top: 1rem;
    padding: 1rem;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`
const WorkArea = styled.div`
    padding: 1rem;
    flex-grow: 1;
`
const OptionsPanel = styled.div`
    min-width: 20rem;
    max-width: 20rem;
    background-color: #cccccc;
    padding: .8rem;
`

export interface descriptor_menu {
    [key: string]: { name: string, in: input[] }[]
}

const rainbow: rgb[] = [0, 1, 2, 3, 4, 5].map(i => cc.hsv.rgb([60 * i, 100, 100,]))
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
    signatures: signatures): [number | boolean | rgb | rgb[] | number[] | rgbw[], input] {

    if (item.type !== "func")
        throw new Error("invalid item type")

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


export function pathEquals(a: number[], b: number[]) {
    return a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

interface IEditorContext {
    update_value: (new_value: Partial<mode_param>, path: number[],) => void;
    set_value: (new_value: mode_param, path: number[],) => void;
    set_active_path: (path: number[]) => void;
    get_preview: React.FC<{ path: number[] }>;
    active_path: number[];
    onClose: (path: number[]) => void;
    getWrappers: (path: number[]) => string[];
    wrap: (path: number[], name: string) => void;
    showNumericInputs: boolean;
}

export const EditorContext = createContext<IEditorContext>({
    update_value: () => { },
    set_value: () => { },
    set_active_path: () => { },
    get_preview: () => (<p>too early</p>),
    active_path: [],
    onClose: () => { },
    getWrappers: () => [],
    wrap: () => { },
    showNumericInputs: false,
});

interface editorProps {
    name?: string;
    signatures: signatures
}
const FREE_TEXT_KEY = "__free_text__"

function walk_inputs(
    x: func_config,
    signatures: signatures,
    fun: { (x: value_instance, path: number[]): void },
    path?: number[],
) {
    if (typeof path === "undefined")
        path = []

    for (let [i, input] of signatures[x.name].input.entries()) {
        let p = x.params[input.key]
        if (p.type === "func") {
            walk_inputs(p, signatures, fun, [...path, i])
        } else {
            fun(p, [...path, i])
        }
    }
}

const Editor: React.FC<editorProps> = ({ signatures }) => {

    // path to the active element
    const [active_path, set_active_path] = useState<number[]>([])
    const [show, set_show] = useState<func_config | rgb_array_value>(default_show)
    const [colors, set_colors] = useState<rgb[] | rgbw[] | number[]>()
    const [mode, set_mode] = useState<mode>()
    const [loading, set_loading] = useState(true)
    const [showNumericInputs, { toggle: toggleShowNumericInputs }] = useBoolean(true)
    const [show_raw_input, { toggle: toggleShowRawInput }] = useBoolean(false)
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [live, { toggle: toggleLive }] = useBoolean(false);

    const [free_text_option, set_free_text_option] = useState<string>()
    const [nameKey, set_nameKey] = useState<string | number | undefined>()
    const [existing_modes, set_existing_modes] = useState<IComboBoxOption[]>()
    const [existing_shows, set_existing_shows] = useState<{ [key: string]: func_config | rgb_array_value }>()
    const [ui_components, set_ui_components] = useState<ui[]>([])
    const [generators, set_generators] = useState<string[]>([])

    const [loop] = useState<ILoop>(() => make_loop(set_colors, { leds: 8 }))

    const [loading_libraries, set_loading_libraries] = useState(true)
    const [loading_libraries_error, set_loading_libraries_error] = useState<string>()

    useEffect(() => {
        /* on load */
        let canceled = false;
        (async () => {
            try {
                await load_remotes();
            } catch (error) {
                if (canceled) return
                set_loading_libraries_error((error as any).message || "Something went wrong")


            } finally {
                if (canceled) return
                set_loading_libraries(false)
            }
        })()
        return () => { canceled = true }
    }, [])

    const set = useCallback((
        new_value: mode_param,
        path: number[],
    ) => {
        if (path.length === 0) {
            // special case
            console.log("setting show to new value", new_value)
            set_show(new_value as rgb_array_value | func_config)
            set_active_path([])

            if (new_value.type === "func") {
                console.log("re-building")
                try {
                    const mode = loop.start(new_value)
                    console.log("........ loop start returned", typeof mode, Array.isArray(mode))
                    set_mode(() => mode)
                } catch (error) {
                    console.log("bad show:", new_value)
                    console.log("something went wrong while restarting the loop:", error)
                    loop.stop()
                }
            } else {
                loop.stop()
            }
            return
        }

        let old_value: mode_param = get_item_at_path(show, path, signatures)[0]

        // error checking
        let old_type = old_value.type === "func" ? signatures[old_value.name].output : old_value.type
        let new_type = new_value.type === "func" ? signatures[new_value.name].output : new_value.type
        if (old_type !== new_type)
            throw new Error(`type of previous value (${old_type}) is not compatible with new value (${new_type})`)

        // update the show
        let new_show = copy(show)
        let parent: func_config = get_item_at_path(new_show, path.slice(0, path.length - 1), signatures)[0] as func_config
        parent.params[signatures[parent.name].input[path[path.length - 1]].key] = new_value

        console.log("new_show.type", new_show.type)
        if (new_show.type === "func") {
            const mode = loop.start(new_show)
            set_mode(() => mode)
        } else {
            loop.stop()
        }
        set_show(new_show)
        set_active_path(path)

    }, [show, set_show, set_mode, loop, signatures])

    const NameOptions: IComboBoxOption[] = free_text_option ? [
        { key: FREE_TEXT_KEY, text: free_text_option },
        ...existing_modes!
    ] : existing_modes!

    const init = useCallback(
        async () => {
            const shows = await fetch_modes()
            set_existing_modes(shows.map(m => ({ text: m.name, key: m.name })))
            const entries = shows
                .map(s => [s.name, s.def as func_config]);
            const d_shows = Object.fromEntries(entries)
            set_existing_shows(d_shows)
            set_loading(false)
        }
        , [])

    // useEffect(() => console.log("INIT did change"), [init])
    // useEffect(() => console.log("SET did change"), [set])
    // useEffect(() => console.log("LOOP did change"), [loop])

    const globals_ref = useRef<{
        init: () => void, loop: ILoop, set: (
            new_value: mode_param,
            path: number[],
        ) => void
    }>({ init, loop, set })

    globals_ref.current.init = init
    globals_ref.current.loop = loop
    globals_ref.current.set = set

    useEffect(() => {
        /* component will mount */
        console.log("COMPONENT WILL MOUNT")
        globals_ref.current.init();
        // update_LEDS();
        globals_ref.current.set(default_show, [])

        const loop = globals_ref.current.loop
        // component will unmount
        return function cleanup() {
            loop.stop();
            // live && (async () => { await fetch("/api/mode/off"); })()
        };
    }, [globals_ref]); // Dont add the dependencies!!! init, set, loop

    const disableSave = (!nameKey) || !(nameKey === FREE_TEXT_KEY ? free_text_option! : (nameKey as string)).length

    const saveShow = useCallback(async () => {
        const name = nameKey === FREE_TEXT_KEY ? free_text_option! : (nameKey as string)
        await save_mode({
            name,
            def: show,
            ui: ui_components
        })
        init()
    }, [show, free_text_option, nameKey, ui_components, init])

    const deleteShow = useCallback(async () => {
        await delete_mode(
            nameKey === FREE_TEXT_KEY ? free_text_option! : (nameKey as string),
        )
        set(default_show, [])
        init()
    }, [init, set, free_text_option, nameKey])

    const getWrappers = (path: number[]): string[] => {

        const old_value: func_config = get_item_at_path(show, path, signatures)[0] as func_config
        const s = signatures[old_value.name]
        const old_type = s.output
        return Object.entries(signatures)
            .filter(e => {
                const s = e[1]
                return s.output === old_type && (s.input.filter((p: input) => p.type === old_type).length > 0)
            }).map(e => e[0]).sort()

    }

    const getUIcomponents = useCallback((p: func_config): ui[] => {
        const inputs: ui[] = []
        walk_inputs(p, signatures, (el: value_instance, path: number[]) => {
            if (typeof el.ui !== "undefined")
                inputs.push(el.ui)
        })
        return inputs
    }, [signatures])

    const onClose = (path: number[]): void => {

        const old_value: func_config = get_item_at_path(show, path, signatures)[0] as func_config
        const s = signatures[old_value.name]
        const old_type = s.output
        const similar_children = s.input.filter((p: input) => p.type === old_type)

        if (similar_children.length) {
            set((old_value as func_config).params[similar_children[0].key], path)
        } else {
            if (active_path.length === 0) {
                set(default_show, [])
            } else {
                const _input = get_item_at_path(show, active_path, signatures)[1]
                set({
                    type: _input!.type,
                    // @ts-ignore no (simple) way to check this 
                    value: _input!.default
                }, active_path)
            }
        }
    }

    const update_LEDS = useCallback((async () => {
        if (show.type === "func") {
            // const response =
            await fetch("/api/mode/", {
                method: 'POST',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "editor", def: show })
            });
        } else {
            if (!Array.isArray(show.value))
                return
            // const response =
            await fetch("/api/mode/off")
            await fetch("/api/lights/set-colors", {
                method: 'POST',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(show.value)
            });
        }
    }), [show])

    useEffect(() => {
        live && update_LEDS()
        if (show.type === "func")
            set_ui_components(getUIcomponents(show))
    }, [show, live, update_LEDS, set_ui_components, getUIcomponents]);

    const [active_item, active_input] = get_item_at_path(show, active_path, signatures)

    // A list of functions whose outputs are the same as the current item type
    //const generators: string[] = Object.entries(signatures).filter(e => e[1].output === value_type).map(e => e[0]).sort()
    useEffect(() => {
        // working here
        // working here
        // working here
        // working here
        if (active_path.length === 0) {
            set_generators(Object.entries(signatures)
                .filter(e => ROOT_TYPES.indexOf(e[1].output) !== -1)
                .map(e => e[0]).sort())
        } else {
            const value_type: value = active_item.type === "func" ? signatures[active_item.name].output : active_item.type as value;
            set_generators(Object.entries(signatures)
                .filter(e => e[1].output === value_type)
                .map(e => e[0]).sort())
        }

    }, [active_path.length, active_item, signatures])

    const RootPreview = useCallback(() => {
        if (!colors || colors === null || colors.length === 0)
            return <p>too early (no colors)</p>
        if (typeof colors[0] === "number")
            return <WArray w={colors as number[]} />
        if (colors[0].length === 3)
            return <ColorArray colors={colors as rgb[]} />
        else
            return <RGBWArray colors={colors as rgbw[]} />
    }, [colors])


    const get_preview = useCallback((props: { path: number[] }) => {

        if (props.path.length === 0)
            return RootPreview()

        const [data, input] = get_preview_at_path(mode!, show, props.path, signatures)

        switch (input.type) {
            case "button":
                return <DefaultButton>{data}</DefaultButton>
            case "boolean":
            case "number":
            case "integer": {
                return (<p>{data}</p>)
            }
            case "rgb": { return <ColorArray colors={[data as rgb]} /> }
            case "rgb[]": { return <ColorArray colors={data as rgb[]} /> }
            case "rgbw[]": { return <RGBWArray colors={data as rgbw[]} /> }
            case "rgbw": { return <RGBW color={data as rgbw} /> }
            case "number[]": { return <WArray w={data as number[]} /> }

            default: {
                let exhaustivenessCheck: never = input;
                console.log(exhaustivenessCheck);
                // @ts-ignore
                return (<p>Unknown input type {input.type}</p>)
            }


        }
    }, [mode, signatures, show, RootPreview])

    const update_value = useCallback((
        new_value: Partial<mode_param>,
        path: number[],
    ) => {
        let old_value: mode_param = get_item_at_path(show, path, signatures)[0]
        // @ts-ignore
        set({ ...old_value, ...new_value }, path)

    }, [show, set, signatures])

    const onDropdownChanged = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        console.log("A")
        if (!option)
            return
        console.log("B", option.key)
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
            console.log('func C', func, active_path)
            set(func, active_path)
        }
    }

    const wrap = (path: number[], name: string): void => {

        const old_value: func_config = get_item_at_path(show, path, signatures)[0] as func_config
        const s = signatures[old_value.name]
        // const old_type = s.output
        let unwrapped = true

        const new_func_config: func_config = {
            type: "func",
            name,
            // @ts-ignore no (simple) way to check this 
            params: Object.fromEntries(
                signatures[name].input.map(o => {
                    if (unwrapped && o.type === s.output) {
                        unwrapped = false
                        return [o.key, old_value]
                    }
                    return [o.key, { type: o.type, value: o.default }]
                })
            )
        }
        console.log('[WRAP] current path', path)
        console.dir(new_func_config)
        set(new_func_config, path)
    }

    const onNameChange = React.useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
            let key = option?.key;
            if (!option && value) {
                // If allowFreeform is true, the newly selected option might be something the user typed that
                // doesn't exist in the options list yet. So there's extra work to manually add it.
                set_free_text_option(value)
                set_nameKey(FREE_TEXT_KEY);
            } else {
                set_nameKey(key);

                if (existing_shows && typeof key === "string" && key !== FREE_TEXT_KEY) {
                    set(existing_shows[key], [])
                    // console.log('setting show name', [key])
                    // console.log('typeof existing', typeof existing_shows)
                    // console.log('setting show', existing_shows[key])
                    // set_show(existing_shows[key])
                    // set_active_path([])
                }
            }
        },
        [existing_shows, set],
    );


    if (loading || loading_libraries) {
        return (<div>
            <Spinner label="I am totally loading..." size={SpinnerSize.large} />
        </div>)
    }
    if (loading_libraries_error) {
        return (<div>
            <p>Dang, something went wrong when loading user libraries</p>
            <p style={{ color: "red" }}>{loading_libraries_error}</p>
        </div>)
    }
    return (
        <EditorContext.Provider value={{
            set_active_path,
            get_preview,
            active_path,
            set_value: set,
            update_value,
            onClose,
            getWrappers,
            wrap,
            showNumericInputs,
        }}>
            <Header>
                <Label>Mode Name</Label>
                <ComboBox
                    allowFreeform={true}
                    autoComplete={'on'}
                    options={NameOptions}
                    styles={comboBoxStyles}
                    selectedKey={nameKey}
                    onChange={onNameChange}
                />
                <div style={{ margin: "auto" }}></div>
                <IconButton
                    onClick={toggleLive}
                    title="Use Live Updates"
                    style={{ color: live ? ACTIVE_COLOR : "black" }}
                    icon={faBolt}
                />
                <IconButton
                    onClick={toggleShowNumericInputs}
                    title="Show numeric inputs"
                    style={{ color: showNumericInputs ? ACTIVE_COLOR : "black" }}
                    icon={faHashtag}
                />
                <IconButton
                    onClick={toggleShowRawInput}
                    title="Show raw data"
                    style={{ color: show_raw_input ? ACTIVE_COLOR : "black" }}
                    icon={faCode}
                />
                <IconButton
                    onClick={() => (!disableSave && toggleHideDialog())}
                    title="Delete Show"
                    style={{ color: disableSave ? "#dddddd" : "black" }}
                    icon={faTrashAlt}
                />

                <PrimaryButton
                    onClick={saveShow}
                    disabled={disableSave}
                >Save</PrimaryButton>
            </Header>
            <Container>
                <WorkArea>
                    {show.type === "func" ? (
                        <div>
                            <FuncValue
                                config={show}
                                path={[]}
                                signatures={signatures}
                            />
                        </div>
                    ) : (<ColorArray colors={show.value} />)}
                    {ui_components.length > 0 && (
                        <>
                            <h3 style={{ marginTop: "2rem" }}>UI Components</h3>
                            <UI ui={ui_components} />
                            {/* <pre>{JSON.stringify(ui_components, null, 2)}</pre> */}
                        </>
                    )}
                    {show_raw_input &&
                        <div>
                            <Label>Raw Data:</Label>
                            <pre>{JSON.stringify({ def: show, ui: ui_components }, null, 4)}</pre>
                        </div>
                    }
                </WorkArea>
                <OptionsPanel>
                    {(generators.length > 0) && <Dropdown
                        label="Input Type"
                        selectedKey={active_item.type === "func" ? active_item.name : "constant"}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={onDropdownChanged}
                        placeholder="Select an option"
                        options={["constant", ...generators].map(s => ({ key: s, text: s }))}
                    />}
                    {active_item.type === "boolean" && (
                        <BooleanOptions
                            value={active_item.value}
                            spec={active_input as boolean_input}
                            path={active_path}
                        />
                    )}
                    {(active_item.type === "number" || active_item.type === "integer") && (
                        <NumberOptions
                            value={active_item.value}
                            spec={active_input as range_input | integer_input}
                            path={active_path}
                        />
                    )}
                    {active_item.type === "rgb" && (
                        <ColorOptions
                            value={active_item.value}
                            spec={active_input as color_input}
                            path={active_path}
                        />
                    )}
                    {active_item.type === "rgb[]" && (
                        <ColorArrayOptions
                            value={active_item.value}
                            spec={active_path.length === 0 ? default_spec : (active_input as color_array_input)}
                            path={active_path}
                        />
                    )}
                    {VALUE_NAMES.indexOf((active_item as value_instance).type) !== -1 && (
                        <UISelector
                            el={active_item as value_instance}
                            spec={active_input!}
                            path={active_path}
                            onChange={
                                (ui: ui | undefined) =>
                                    // @ts-ignore
                                    set({ ...active_item as value_instance, ui }, active_path)
                            }
                        />
                    )}


                </OptionsPanel>
            </Container>
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={dialogContentProps}
                modalProps={{ isBlocking: false, styles: dialogStyles, }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => { toggleHideDialog(); deleteShow() }} text="Delete" />
                    <DefaultButton onClick={toggleHideDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        </EditorContext.Provider >
    )
};

const EditorTab: React.FC = () => {

    const [signatures, set_signatures] = useState<signatures>()

    useEffect(() => {
        if (typeof signatures !== "undefined") return
        let canceled = false;
        (async () => {
            try {
                console.log("fetching")
                const res = (await fetch("/api/registry/descriptors"));
                const data: { [key: string]: signature } = await res.json()
                if (canceled) return
                console.log("setting signatures canceled... ", canceled)
                set_signatures(data)
            } catch (err) {
                console.log("erroring", err)
            }
        })()
        return () => { canceled = true }
    }, [signatures])

    if (typeof signatures === "undefined")
        return (<div><p>Loading...</p></div>)

    if (Object.keys(signatures).length === 0)
        return (<div><p>Something went wrong -- no functions available...</p></div>)

    return (<Editor
        signatures={signatures}
    />)
}

export default EditorTab