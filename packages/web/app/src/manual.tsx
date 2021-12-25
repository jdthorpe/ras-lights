import React from "react"
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import debounce from "lodash.debounce"
import {
    ColorPicker,
    getColorFromString,
    IColor,
    IColorPickerStyles,
} from '@fluentui/react/lib/index';

async function turnOff() {
    try {
        console.log(`/lights/off `)
        const res = await fetch("/lights/off")
        console.log("/lights/off SUCCESS", res)
    } catch (err) {
        console.log("/lights/off failed with error", err)
    }
}

async function setRandomColors() {
    try {
        console.log(`/lights/random `)
        const res = await fetch("/lights/random")
        console.log("/lights/random SUCCESS", res)
    } catch (err) {
        console.log("/lights/random failed with error", err)
    }
}

async function update_color(x: IColor) {
    try {
        console.log(`/lights/set-colors ${[[x.r, x.g, x.b]]}`)
        const res = await fetch("/lights/set-colors", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([[x.r, x.g, x.b]])
        });
        console.log("/lights/set-colors SUCCESS", res)
    } catch (err) {
        console.log("/lights/set-colors failed with error", err)
    }
}



const Manual: React.FC = () => {
    const [color, setColor] = React.useState(white);

    const updateColor = React.useCallback(debounce((ev: any, colorObj: IColor) => {
        setColor(colorObj)
        update_color(colorObj)
    }, 25), []);

    return (
        <>
            <PrimaryButton onClick={setRandomColors} text="Random Colors" />
            <PrimaryButton onClick={turnOff} text="Off" />
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
        </>
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