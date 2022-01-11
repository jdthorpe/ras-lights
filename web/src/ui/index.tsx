import React, { useState, useContext } from 'react';
import styled from "styled-components"
import { Button } from "./button";
import { ToggleInput } from "./toggle"
import { SliderInput } from "./slider";
import { ColorArrayInput, ColorInput } from "./color";
import { ui, ui_type, ui_rgb, ui_rgb_array, ui_slider, ui_toggle } from '@ras-lights/common/types/user-input';
import { ToolContext } from "./utils"
// import { bool_value, button_value, num_value, rgb_array_value, rgb_value } from '@ras-lights/common/types/mode';

const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    heigth:100%;
`
const OptionsPanel = styled.div`
    min-width: 20rem;
    max-width: 20rem;
    padding: .8rem;
    background-color: #cccccc;
`

let foo: null | React.FC = null;

export const UI: React.FC<{ ui: ui[] }> = ({ ui }) => {


    // const tool = useContext(ToolContext);
    const [Preview, SetPreview] = useState<null | React.FC>(null)
    const [something, SetSomething] = useState(1)

    console.log(something,
        Preview === null ? "null" : typeof Preview,
        foo === null ? "null" : typeof foo,
        foo === Preview)

    return <ToolContext.Provider value={{
        setPreview: (x) => {
            // alert(`Got a ${typeof x} ${typeof x === "function" && "that returns a " + typeof (x())}`);
            SetPreview(x)
            SetSomething(something + 1)
        },
        clear: () => SetPreview(null),
    }} >
        <Row>
            {ui.map((data: ui, i) =>
                <div key={i} style={{ margin: 10 }} onClick={() => {
                    alert("setting null preview")
                    SetPreview(null)
                }}>
                    <UI_instance ui={data} />
                </div>
            )}
            <OptionsPanel>
                {something}
                {Preview === null ? "null" : typeof Preview}
                {Preview && <Preview />}
            </OptionsPanel>
        </Row>
    </ToolContext.Provider>
}



const UI_instance: React.FC<{ ui: ui }> = ({ ui }) => {
    const type: ui_type = ui.type

    switch (type) {
        case "button":
            return <Button ui={ui} />
        case "color-picker":
            return <ColorInput ui={ui as ui_rgb} />
        case "color[]-picker":
            return <ColorArrayInput ui={ui as ui_rgb_array} />
        case "slider":
            return <SliderInput ui={ui as ui_slider} />
        case "toggle":
            return <ToggleInput ui={ui as ui_toggle} />
        default:
            const checker: never = type
            console.log(checker)
            return <p>Unknown ui type "{type}"</p>
    }
}
