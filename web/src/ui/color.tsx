import React, { useContext, useState, useCallback } from 'react';
import { Color, ColorArray, ColorValuePicker, ColorArrayPicker } from '../editor/inputs/color-input';
import { Label } from '@fluentui/react/lib/Label';
import { rgb } from 'shared/types/mode';
import { ui_rgb, ui_rgb_array } from 'shared/types/user-input';
import { ToolContext } from "./utils"
import { set_update } from "./utils"

export const ColorInput: React.FC<{ ui: ui_rgb }> = ({ ui }) => {

    const [color, setColor] = useState<rgb>(ui.default)
    const updateColor = (c: rgb) => {
        set_update(ui.key, c)
        setColor(c)
    }

    const control = useContext(ToolContext);
    const setControl = useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        // @ts-ignore
        control.setPreview(() => () => {
            return <ColorValuePicker
                color={color}
                onChange={updateColor}
            />
        })
    }, [color])

    return (
        <div onClick={setControl}>
            <Label>{ui!.label}</Label>
            <Color color={color} />
        </div>
    )
}

export const ColorArrayInput: React.FC<{ ui: ui_rgb_array }> = ({ ui }) => {

    const [colors, setColors] = useState<rgb[]>(ui.default)
    const updateColors = (c: rgb[]) => {
        set_update(ui.key, c)
        setColors(c)
    }

    const control = useContext(ToolContext);
    const setControl = useCallback(() => {
        // @ts-ignore
        control.setPreview(() => () =>
            <ColorArrayPicker
                colors={colors}
                onChange={updateColors}
            />)
    }, [colors])

    return (
        <div onClick={setControl}>
            <Label>{ui.label}</Label>
            <ColorArray colors={ui.default} />
        </div>
    )
}
