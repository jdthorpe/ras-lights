import React, { useState, useEffect } from "react"
import styled from "styled-components"
import templateBuilder from "./template"
import InputPicker from "./input"
import { value, input, color_array_input, color_input } from 'shared/types/parameters';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { rgb } from 'shared/types/mode';
// import { Dropdown } from '@fluentui/react/lib/Dropdown';
import ValuePicker from "./valuePicker"

import copy from 'copy-to-clipboard';

// import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ColorArrayPicker, ColorValuePicker } from "../editor/inputs/color-input"

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import sh from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
// import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atomOneDark';

SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('bash', sh);


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

// const Editor: React.FC<{ code: string }> = ({ code }) => {
//     const extensions = useMemo<Extension[]>(
//         () => [basicSetup, oneDark, javascript({ typescript: true })],
//         []
//     )
//     const [value, setValue] = useState(code)
//     return (
//         <div style={{ maxWidth: 1000 }}>
//             <CodeMirror
//                 value={code}
//                 onUpdate={(v) => {
//                     if (v.docChanged) {
//                         setValue(v.state.doc.toString())
//                     }
//                 }}
//                 extensions={extensions}
//             />
//         </div>
//     )
// }

let input_number = 0
const default_input = (): color_input => ({
    type: "rgb",
    default: [0, 0, 255],
    label: `My Color ${input_number}`,
    key: `input_${input_number++}`
})

function validateInputs(x: input[]): string[] {
    const out: string[] = []
    const keys = new Set<string>()
    const labels = new Set<string>()
    for (let input of x) {
        if (keys.has(input.key)) {
            out.push(`keys must be unique but "${input.key}" appears more than once`)
        }
        if (labels.has(input.label)) {
            out.push(`labels must be unique but "${input.label}" appears more than once`)
        }
        labels.add(input.label)
        keys.add(input.key)
    }

    return out
}

const Template: React.FC = () => {

    const [name, setName] = useState<string>("My Awesome Effect")
    const [code, setCode] = useState<string>("")
    const [inputs, setInputs] = useState<(input)[]>([])
    const [output, setOutput] = useState<value>("rgb[]")
    const [activeInput, setActiveInput] = useState<number>(0)
    const [errors, set_errors] = useState<string[]>([])


    const updateInput = (input: input, i: number) => {
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
        setInputs(tmp)
    }
    const moveDown = (i: number) => {
        if (i === inputs.length - 1)
            return
        const tmp = Array.from(inputs)
        tmp.splice(i, 1)
        tmp.splice(i + 1, 0, inputs[i])
        setInputs(tmp)
    }

    useEffect(() => {
        /* quality checks */

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

        set_errors(validateInputs(inputs))

    }, [inputs, name, output])

    return (
        <div style={{
            width: "100%", maxWidth: 1200, margin: "auto"
        }}>
            <Container>
                <div style={{ marginTop: 15, flexGrow: 1 }}>

                    <Row>
                        <ValuePicker
                            label="Output Type"
                            onChange={setOutput} />
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => newValue && setName(newValue)}
                            styles={nameTextBoxstyle} />
                    </Row>

                    <Row style={{ justifyContent: "space-between", }}>
                        <h3>Inputs</h3>
                        <DefaultButton style={{ alignSelf: 'center' }}
                            onClick={() => setInputs([...inputs, default_input()])}
                        >Add Input</DefaultButton>
                    </Row>

                    {inputs.map((input, i) => (
                        <div key={i} style={{
                            // padding: "5px",
                            backgroundColor: (i % 2 === 1) ? "none" : "#dddddd",
                            border: "1px black",
                            borderRadius: 4,
                        }}>
                            {/* <p>{JSON.stringify(input)}</p> */}
                            <InputPicker
                                input={input}
                                onChange={(inp: input) => updateInput(inp, i)}
                                onRemove={() => dropInput(i)}
                                onActivate={() => setActiveInput(i)}
                                onUp={() => moveUp(i)}
                                onDown={() => moveDown(i)}
                            />
                        </div>
                    ))}

                    {errors.length > 0 && (
                        <>
                            <h3 style={{ color: "red" }}>Errors:</h3>
                            <ul>
                                {errors.map((e, i) => (<li key={i} style={{ color: "red" }}>{e}</li>))}
                            </ul>
                        </>
                    )}

                    <Row style={{ justifyContent: "space-between", }}>
                        <h3 >Code Template</h3>
                        <DefaultButton style={{ alignSelf: "center" }} onClick={() => copy(code)}>Copy to Clipboard</DefaultButton>
                    </Row>
                    {/* <Editor code={code} /> */}

                    <SyntaxHighlighter language="typescript" style={atomOneDark} showLineNumbers={true}>
                        {code}
                    </SyntaxHighlighter>
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