import React, { useEffect, useState } from "react"
// DefaultButton, 
import { PrimaryButton } from '@fluentui/react/lib/Button';
import debounce from "lodash.debounce"
import {
    ColorPicker,
    getColorFromString,
    IColor,
    IColorPickerStyles,
} from '@fluentui/react/lib/index';
import styled from "styled-components"
import useCallback from 'react';

const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

async function turnOff() {
    try {
        await fetch("/api/mode/off")
    } catch (err) {
        console.log("/lights/off failed with error", err)
    }
}

async function setRandomColors(on: boolean) {
    try {
        if (on)
            await fetch("/api/mode/off")
        await fetch("/api/lights/random")
    } catch (err) {
        console.log("/lights/random failed with error", err)
    }
}

async function update_color(x: IColor, on: boolean) {
    try {
        if (on)
            await fetch("/api/mode/off")
        await fetch("/api/lights/set-colors", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([[x.r, x.g, x.b]])
        });
    } catch (err) {
        console.log("/lights/set-colors failed with error", err)
    }
}


const Manual: React.FC = () => {
    const [color, setColor] = useState(white);
    const [on, set_on] = useState(true)

    const updateColor = React.useCallback(debounce((ev: any, colorObj: IColor) => {
        set_on(false)
        setColor(colorObj)
        update_color(colorObj, on)
    }, 25), [setColor, update_color, on]);

    const set_random = React.useCallback(debounce(() => {
        set_on(false)
        setRandomColors(on)
    }, 25), [on]);

    // useEffect(() => { fetch("/api/mode/off") }, [])

    return (
        <div style={{ margin: "1.5rem" }}>
            <Row>
                <PrimaryButton onClick={set_random} text="Random Colors" />
                <PrimaryButton onClick={turnOff} text="Off" />
            </Row>
            <h3>Click to pick a single color</h3>
            <ColorPicker
                color={color}
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

const white = getColorFromString('#ffffff')!;

const colorPickerStyles: Partial<IColorPickerStyles> = {
    panel: { padding: 12 },
    root: {
        maxWidth: 352,
        minWidth: 352,
    },
    colorRectangle: { height: 268 },
};

export default Manual