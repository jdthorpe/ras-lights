import React, { useState, useContext } from 'react';
import debounce from "lodash.debounce"
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import styled from "styled-components"
import cc from "color-convert"
import {
    ColorPicker,
    IColor,
    IColorPickerStyles,
} from '@fluentui/react/lib/index';
import { Label } from '@fluentui/react/lib/Label';
import { rgb } from 'shared/types/mode';

import { color_input, color_array_input, number_array_input } from "shared/types/parameters"
import { EditorContext, pathEquals } from '../editor';

const WrappedRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: .7rem;
`

const SIZE = "32px"
const CLOSE_SIZE = "1.1rem"
const CLOSE_FONT_SIZE = "0.9rem"

const ColorBox = styled.div.attrs<{ color: string }>(props => ({
    style: { backgroundColor: props.color }
}))`
    height: 32px;
    width: 32px;
    border-style: solid;
    border-width: 1px;
    border-radius: 2px;
    border-color: black;
    box-sizing: border-box;
`



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
    panel: {
        padding: 0,
        marginTop: 12,
        marginBottom: 12,
    },
    root: {
        maxWidth: 352,
        minWidth: 152,
    },
    colorRectangle: { height: 268 },
};

interface color_value_props {
    spec: color_input;
    value: rgb;
}

export const ColorValue: React.FC<color_value_props> = ({ spec, value }) => {

    return (
        <div
            style={{
                display: 'inline-block',
                margin: "0 .5rem",
            }}>
            <Label>{spec.label}</Label>
            <ColorBox color={`#${cc.rgb.hex(value)}`} />
        </div>
    )
}


export const Color: React.FC<{ color: rgb }> = ({ color }) => (
    <ColorBox color={`#${cc.rgb.hex(color)}`} />
)

interface color_input_props {
    spec: color_input;
    value: rgb;
    path: number[];
}

// <FontIcon aria-label="Remove" iconName="Cancel" className={iconClass} onClick={() => setOpen(false)} />

export const ColorOptions: React.FC<color_input_props> = ({ value, path, spec }) => {

    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    return (
        <div
            style={{ backgroundColor: is_active ? "#cccccc" : "none" }}
        >
            <Label>{spec.label}</Label>
            <ColorValuePicker
                color={value}
                onChange={(color) => editor.update_value({ value: color }, path)} />
        </div>
    )
}

interface colorValuePickerProps {
    onChange: (x: rgb) => void;
    color: rgb;
}

export const ColorValuePicker: React.FC<colorValuePickerProps> = ({ color, onChange }) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateColor = React.useCallback(debounce((ev: any, color: IColor) => {
        onChange([color.r, color.g, color.b,])
    }, 50), [onChange]);

    return (
        <ColorPicker
            color={`#${cc.rgb.hex(color)}`}
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
    )
}


export const ColorArray: React.FC<{ colors: rgb[] }> = ({ colors }) => {
    try {
        return (
            <WrappedRow >
                {colors.map((color: rgb, i) => (
                    <ColorBox key={i} color={`#${cc.rgb.hex(color)}`} />
                ))}
            </WrappedRow>
        )
    } catch (e) {
        console.log(e)
        return <div>something went wrong</div>
    }
}

export const WArray: React.FC<{ w: number[] }> = ({ w }) => {
    return (<ColorArray colors={w.map(v => [v, v, v])} />)
}


export const WArrayValue: React.FC<{ spec: number_array_input; value: number[]; }> =
    ({ value, spec }) => {
        return (
            <>
                <Label>{spec.label}</Label>
                <ColorArray colors={value.map(v => [v, v, v])} />
            </>
        )
    }



interface color_array_value_props {
    spec: color_array_input;
    value: rgb[];
}

export const ColorArrayValue: React.FC<color_array_value_props> =
    ({ value: colors, spec }) => {
        return (
            <>
                <Label>{spec.label}</Label>
                <ColorArray colors={colors} />
            </>
        )
    }

interface color_array_input_props {
    spec: color_array_input;
    value: rgb[];
    // onChanged: { (x: rgb[]): void };
    path: number[];
}

export const ColorArrayOptions: React.FC<color_array_input_props> = ({ value: colors, spec, path }) => {

    const editor = useContext(EditorContext);
    const is_active = pathEquals(editor.active_path, path)

    return (
        <div
            style={{ backgroundColor: is_active ? "#cccccc" : "tranparent" }}
        >
            <Label>{spec.label}</Label>
            <ColorArrayPicker
                colors={colors}
                onChange={
                    (value) => editor.update_value({ value }, path)
                } />
        </div>
    )
}



interface colorArrayPickerProps {
    onChange: (x: rgb[]) => void;
    colors: rgb[];
}

export const ColorArrayPicker: React.FC<colorArrayPickerProps> = ({ colors, onChange }) => {

    const [active_color, set_active_color] = useState(0)

    const addColor = React.useCallback(() => {
        const value = [
            ...colors.slice(0, active_color),
            colors[active_color],
            ...colors.slice(active_color),
        ]
        onChange(value)
        set_active_color(active_color + 1)
    }, [onChange, colors, active_color]);


    const dropColor = React.useCallback((i: number) => {
        const value = [
            ...colors.slice(0, i),
            ...colors.slice(i + 1),
        ]
        onChange(value)
        if (active_color > i) {
            set_active_color(active_color - 1)
        }
    }, [onChange, colors, active_color]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateColor = React.useCallback(debounce((ev: any, color: IColor) => {
        const value: rgb[] = [
            ...colors.slice(0, active_color),
            [color.r, color.g, color.b,],
            ...colors.slice(active_color + 1),
        ]
        onChange(value)
    }, 25), [onChange, colors, active_color]);

    return (<>
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
                            left: `calc(${SIZE} - ${CLOSE_SIZE} / 2)`,
                            top: "-.4rem",
                            borderRadius: "2px",
                            borderWidth: "1px",
                            borderColor: "black",
                            backgroundColor: "#eeeeee",
                            width: CLOSE_SIZE,
                            height: CLOSE_SIZE,
                            padding: "1px",
                            fontSize: CLOSE_FONT_SIZE
                        }}
                        onClick={() => dropColor(i)}
                    >
                        <FontIcon
                            aria-label="Remove"
                            iconName="Cancel"
                            className={smallIcon}
                            style={{
                                margin: "auto",
                                position: "relative",
                                // top: "calc(50% - .8rem)",
                                top: "calc(50% - .75rem)",
                                display: "block",
                                fontSize: "1rem",
                                width: "1rem",
                            }}
                        />
                    </div>
                </div>
            ))}
            <div >
                <div
                    style={{
                        height: SIZE,
                        width: SIZE,
                        backgroundColor: "#eeeeee",
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
                            margin: "auto",
                            position: "relative",
                            top: "calc(50% - .8rem)",
                            display: "block",
                            fontSize: "1.2rem",
                            width: "1.2rem",
                            // marginTop: ".25rem",
                            // marginLeft: ".25rem",
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
    </>)
}
