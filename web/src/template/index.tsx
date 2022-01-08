import React, { useState, useMemo, useEffect } from "react"
import styled from "styled-components"
import templateBuilder from "./template"
import InputPicker from "./input"
import { value, input, color_array_input, color_input } from '@ras-lights/common/types/parameters';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { rgb } from "@ras-lights/common/types/mode"
import ValuePicker from "./valuePicker"

import CodeMirror from 'rodemirror'
import { Extension } from '@codemirror/state'
import { basicSetup } from '@codemirror/basic-setup'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
import { ColorArrayPicker, ColorValuePicker } from "../editor/inputs/color-input"

const nameTextBoxstyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "15rem" } };

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 10px;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`

const OptionsPanel = styled.div`
    min-width: 20rem;
    max-width: 20rem;
    padding: .8rem;
`


const Editor: React.FC<{ code: string }> = ({ code }) => {
    const extensions = useMemo<Extension[]>(
        () => [basicSetup, oneDark, javascript({ typescript: true })],
        []
    )

    const [value, setValue] = useState(code)

    return (
        <div style={{ maxWidth: 1000 }}>
            <CodeMirror
                value={code}
                onUpdate={(v) => {
                    if (v.docChanged) {
                        setValue(v.state.doc.toString())
                    }
                }}
                extensions={extensions}
            />
        </div>
    )
}

const Template: React.FC = () => {

    const [name, setName] = useState<string>("")
    const [code, setCode] = useState<string>("")
    const [inputs, setInputs] = useState<(input | undefined)[]>([])
    const [output, setOutput] = useState<value>()
    const [activeInput, setActiveInput] = useState<number>(0)


    const updateInput = (input: input | undefined, i: number) => {
        let inp = [...inputs]
        inp[i] = input
        setInputs(inp)
    }

    const dropInput = (i: number) => {
        setInputs([...inputs.slice(0, i), ...inputs.slice(i + 1)])
    }
    const moveUp = (i: number) => {
        if (i === 0)
            return
        const tmp = Array.from(inputs)
        tmp.splice(i, 1)
        tmp.splice(i - 1, 0, inputs[i])
        console.log("settting UP", tmp)
        setInputs(tmp)
    }
    const moveDown = (i: number) => {
        if (i === inputs.length - 1)
            return
        const tmp = Array.from(inputs)
        tmp.splice(i, 1)
        tmp.splice(i + 1, 0, inputs[i])
        console.log("settting down", tmp)
        setInputs(tmp)
    }

    useEffect(() => {

        if (!name)
            return setCode("// Your effect needs a name")
        if (!output)
            return setCode("// Please pick an output type")
        if (!inputs.every(input => typeof input !== "undefined"))
            return setCode("// One of the Inputs needs attention")

        try {
            const code = templateBuilder({
                effectName: name,
                inputs: inputs as input[],
                output_type: output,
            })
            setCode(code)
        } catch (err) {
            setCode(`Something went wrong: ${(err as any).message}`)

        }


    }, [inputs, name, output])

    return (
        <div style={{
            width: "100%", maxWidth: 1200, margin: "auto"
        }}>
            <Container>
                <div style={{ margin: 15, flexGrow: 1 }}>

                    <Row>
                        <ValuePicker
                            label="Output Type"
                            onChange={setOutput} />
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => newValue && setName(newValue)}
                            styles={nameTextBoxstyle} />
                        <DefaultButton
                            style={{ marginLeft: "auto" }}
                            onClick={() => setInputs([...inputs, undefined])}>Add Input</DefaultButton>
                    </Row>

                    <h3 style={{ marginTop: "1rem" }}>Inputs</h3>
                    {inputs.map((input, i) => (
                        <div style={{
                            // padding: "5px",
                            backgroundColor: (i % 2 === 1) ? "none" : "#dddddd",
                            border: "1px black",
                        }}>
                            {/* <p>{JSON.stringify(input)}</p> */}
                            <InputPicker
                                input={input}
                                onChange={(inp: input | undefined) => updateInput(inp, i)}
                                onRemove={() => dropInput(i)}
                                onActivate={() => setActiveInput(i)}
                                onUp={() => moveUp(i)}
                                onDown={() => moveDown(i)}
                            />
                        </div>
                    ))}

                    <h3 style={{ marginTop: "1rem" }}>Code Template</h3>
                    <Editor code={code} />
                </div>
                <OptionsPanel>
                    {inputs[activeInput]?.type === "rgb" &&
                        <ColorValuePicker
                            color={inputs[activeInput]?.default as rgb}
                            onChange={(color: rgb) => {
                                updateInput({ ...(inputs[activeInput] as color_input), default: color }, activeInput)
                            }}
                        />}
                    {inputs[activeInput]?.type === "rgb[]" &&
                        <ColorArrayPicker
                            colors={inputs[activeInput]?.default as rgb[]}
                            onChange={(colors: rgb[]) => {
                                updateInput({ ...(inputs[activeInput] as color_array_input), default: colors }, activeInput)
                            }}
                        />}
                </OptionsPanel>
            </Container>
        </div >)
}

export default Template