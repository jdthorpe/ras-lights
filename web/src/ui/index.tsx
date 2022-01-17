import React, { useState, useContext } from 'react';
import styled from "styled-components"
import { Button } from "./button";
import { ToggleInput } from "./toggle"
import { SliderInput } from "./slider";
import { ColorArrayInput, ColorInput } from "./color";
import { ui, ui_type, ui_rgb, ui_rgb_array, ui_slider, ui_toggle } from 'shared/types/user-input';
import { ToolContext } from "./utils"

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
`

export const UI: React.FC<{ ui: ui[] }> = ({ ui }) => {

    const [Preview, SetPreview] = useState<null | React.FC>(null)
    return <ToolContext.Provider value={{
        setPreview: (x) => {
            SetPreview(x)
        },
        clear: () => SetPreview(null),
    }} >
        <Row>
            {ui.map((data: ui, i) =>
                <div key={i} style={{ margin: 10 }} onClick={() => {
                    SetPreview(null)
                }}>
                    <UI_instance ui={data} />
                </div>
            )}
            <OptionsPanel>
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
