import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Color, ColorArray, ColorValuePicker, ColorArrayPicker } from '../editor/inputs/color-input';
import { Label } from '@fluentui/react/lib/Label';
import { rgb } from 'shared/types/mode';
import { ui_rgb, ui_rgb_array } from 'shared/types/user-input';
import { ToolContext } from "./utils"
import { set_update } from "./utils"

export const ColorInput: React.FC<{ ui: ui_rgb }> = ({ ui }) => {

    const [color, setColor] = useState<rgb>(ui.default)
    const [curr, set_curr] = useState(ui)

    useEffect(() => {
        console.log(Object.is(ui, curr))
        if (Object.is(ui, curr))
            return
        set_curr(ui)
        setColor(ui.default)
    }, [ui, curr])

    const control = useContext(ToolContext);
    const setControl = useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation()
        // @ts-ignore
        control.setPreview(() => () => {
            return <>
                <ColorValuePicker
                    color={color}
                    onChange={(c: rgb) => {
                        set_update(ui.key, c)
                        setColor(c)
                    }}
                />
            </>
        })
    }, [ui, color, control])

    return (
        <div onClick={setControl}>
            <Label>{ui!.label}</Label>
            <Color color={color} />
        </div>
    )
}

export const ColorArrayInput: React.FC<{ ui: ui_rgb_array }> = ({ ui }) => {

    const [colors, setColors] = useState<rgb[]>(ui.default)
    const updateColors = useCallback((c: rgb[]) => {
        set_update(ui.key, c)
        setColors(c)
    }, [setColors, ui.key])

    const control = useContext(ToolContext);
    const setControl = useCallback(() => {
        // @ts-ignore
        control.setPreview(() => () =>
            <ColorArrayPicker
                colors={colors}
                onChange={updateColors}
            />)
    }, [colors, control, updateColors])

    return (
        <div onClick={setControl}>
            <Label>{ui.label}</Label>
            <ColorArray colors={ui.default} />
        </div>
    )
}
