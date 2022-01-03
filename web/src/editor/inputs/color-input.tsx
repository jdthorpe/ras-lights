import React, { useState, useContext } from 'react';
import debounce from "lodash.debounce"
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import styled from "styled-components"
import cc from "color-convert"
import {
    ColorPicker,
    // getColorFromString,
    IColor,
    IColorPickerStyles,
} from '@fluentui/react/lib/index';
import { Label } from '@fluentui/react/lib/Label';
import { rgb } from '@ras-lights/common/types/mode';

import { color_input, color_array_input } from "@ras-lights/common/types/parameters"
import { EditorContext, pathEquals } from '../editor';

const WrappedRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: .7rem;
`

const SIZE = "2rem"
const CLOSE_SIZE = "0.9rem"
const OFFSET = "1.5rem"

const smallIcon = mergeStyles({
    // fontSize: 15,
    // height: "1rem",
    // width: "1rem",
    // margin: '0 10px',
    // left: "-.75rem",
});
const largeIcon = mergeStyles({
    fontSize: "1.5rem",
    // left: "-.75rem",
    // height: 50,
    // width: 50,
    // margin: '0 25px',
});


const colorPickerStyles: Partial<IColorPickerStyles> = {
    panel: { padding: 12 },
    root: {
        maxWidth: 352,
        minWidth: 352,
    },
    colorRectangle: { height: 268 },
};

interface color_value_props {
    spec: color_input;
    value: rgb;
    path: number[]
}

export const ColorValue: React.FC<color_value_props> = ({ spec, value, path }) => {

    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    return (
        <div
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                ev.preventDefault()
                ev.stopPropagation()
                console.log("activating??")
                editor.set_active_path(path)
            }}
            style={{
                display: 'inline-block',
                margin: "0 .5rem",
                backgroundColor: is_active ? "#cccccc" : "transparent"
            }}>
            <Label>{spec.label}</Label>
            <div
                style={{
                    height: SIZE,
                    width: SIZE,
                    backgroundColor: `#${cc.rgb.hex(value)}`,
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderRadius: "2px",
                    borderColor: "black",
                }}
            />
        </div>
    )
}


interface color_input_props {
    spec: color_input;
    value: rgb;
    path: number[];
}

// <FontIcon aria-label="Remove" iconName="Cancel" className={iconClass} onClick={() => setOpen(false)} />

export const ColorInput: React.FC<color_input_props> = ({ value, path, spec }) => {

    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)
    const updateColor = React.useCallback(debounce((ev: any, color: IColor) => {
        editor.set_value({ type: "rgb", value: [color.r, color.g, color.b,] }, path)
    }, 50), [editor]);

    return (
        <div
            style={{ backgroundColor: is_active ? "#cccccc" : "none" }}
        >
            <Label>{spec.label}</Label>
            <ColorPicker
                color={`#${cc.rgb.hex(value)}`}
                onChange={updateColor}
                alphaType="none"
                showPreview={true}
                styles={colorPickerStyles}
                // The ColorPicker provides default English strings for visible text.
                // If your app is localized, you MUST provide the `strings` prop with localized strings.
                strings={{
                    // By default, the sliders will use the text field labels as their aria labels.
                    // Previously this example had more detailed instructions in the labels, but this is
                    // a bad practice and not recommended. Labels should be concise, and match visible text when possible.
                    hueAriaLabel: 'Hue',
                }}
            />
        </div>
    )
}

export const ColorArray: React.FC<{ colors: rgb[] }> = ({ colors }) => {
    return (
        <WrappedRow >
            {colors.map((color: rgb, i) => (
                <div
                    key={i}
                    style={{
                        height: SIZE,
                        width: SIZE,
                        backgroundColor: `#${cc.rgb.hex(color)}`,
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: "2px",
                        borderColor: "black",
                    }}
                />
            ))}
        </WrappedRow>
    )
}



interface color_array_value_props {
    spec: color_array_input;
    value: rgb[];
    path: number[];
}

export const ColorArrayValue: React.FC<color_array_value_props> = ({ value: colors, spec, path }) => {
    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)
    return (
        <div
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                ev.preventDefault()
                ev.stopPropagation()
                editor.set_active_path(path)
            }}
            style={{
                display: 'inline-block',
                backgroundColor: is_active ? "#cccccc" : "none",
            }}>
            <Label>{spec.label}</Label>
            <ColorArray colors={colors} />
        </div>
    )
}

interface color_array_input_props {
    spec: color_array_input;
    value: rgb[];
    // onChanged: { (x: rgb[]): void };
    path: number[];
}

export const ColorArrayInput: React.FC<color_array_input_props> = ({ value: colors, spec, path }) => {

    const [active_color, set_active_color] = useState(0)
    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    const addColor = React.useCallback(() => {

        const value = [
            ...colors.slice(0, active_color),
            colors[active_color],
            ...colors.slice(active_color),
        ]

        editor.set_value({ type: "rgb[]", value }, path)
        set_active_color(active_color + 1)

    }, [editor, colors, active_color]);


    const dropColor = React.useCallback((i: number) => {
        const value = [
            ...colors.slice(0, i),
            ...colors.slice(i + 1),
        ]
        editor.set_value({ type: "rgb[]", value }, path)
        if (active_color > i) {
            set_active_color(active_color - 1)
        }
    }, [editor, colors, active_color]);


    const updateColor = React.useCallback(debounce((ev: any, color: IColor) => {
        const value: rgb[] = [
            ...colors.slice(0, active_color),
            [color.r, color.g, color.b,],
            ...colors.slice(active_color + 1),
        ]
        editor.set_value({ type: "rgb[]", value }, path)
    }, 25), [editor, colors, active_color]);

    return (
        <div
            style={{ backgroundColor: is_active ? "#cccccc" : "tranparent" }}
        >
            <Label>{spec.label}</Label>
            <WrappedRow>
                {colors.map((color: rgb, i) => (

                    <div
                        key={i}
                        style={{ position: "relative" }}>
                        <div
                            style={{
                                height: SIZE,
                                width: SIZE,
                                backgroundColor: `#${cc.rgb.hex(color)}`,
                                borderColor: (i === active_color) ? "red" : "black",
                                borderStyle: "solid",
                                marginTop: (i === active_color) ? undefined : "1px",
                                borderWidth: (i === active_color) ? "2px" : "1px",
                                borderRadius: "2px",
                            }}
                            onClick={() => set_active_color(i)}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: OFFSET,
                                top: "-.4rem",
                                borderRadius: "2px",
                                borderWidth: "0px",
                                backgroundColor: "#cccccc",
                                width: CLOSE_SIZE,
                                height: CLOSE_SIZE,
                                padding: "1px",
                                fontSize: CLOSE_SIZE
                            }}
                            onClick={() => dropColor(i)}
                        >
                            <FontIcon
                                aria-label="Remove"
                                iconName="Cancel"
                                className={smallIcon}
                            />
                        </div>
                    </div>
                ))}
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            height: SIZE,
                            width: SIZE,
                            backgroundColor: "#cccccc",
                            borderStyle: "solid",
                            marginTop: "1px",
                            borderWidth: "1px",
                            borderRadius: "2px",
                        }}
                        onClick={() => addColor()}
                    >
                        <FontIcon
                            aria-label="Add"
                            iconName="Add"
                            className={largeIcon}
                            style={{
                                marginTop: ".25rem",
                                marginLeft: ".25rem",
                            }}
                        />
                    </div>
                </div>
            </WrappedRow>
            <ColorPicker
                color={`#${cc.rgb.hex(colors[active_color])}`}
                onChange={updateColor}
                alphaType="none"
                showPreview={true}
                styles={colorPickerStyles}
                // The ColorPicker provides default English strings for visible text.
                // If your app is localized, you MUST provide the `strings` prop with localized strings.
                strings={{
                    // By default, the sliders will use the text field labels as their aria labels.
                    // Previously this example had more detailed instructions in the labels, but this is
                    // a bad practice and not recommended. Labels should be concise, and match visible text when possible.
                    hueAriaLabel: 'Hue',
                }}
            />
        </div>
    )
}

