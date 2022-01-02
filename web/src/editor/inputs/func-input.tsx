import React, { useContext } from 'react';
import styled from "styled-components"
import useSize from '@react-hook/size'
import { BooleanValue } from './boolean-input';
import { ColorArrayValue, ColorValue } from './color-input';
import {
    input,
    boolean_input,
    integer_input,
    range_input,
    color_input,
    color_array_input,
    signatures,
} from "@ras-lights/common/types/parameters"
import { NumberValue } from './number-input';
import { Label } from '@fluentui/react/lib/Label';
import {
    bool_value, func_config, mode_param,
    num_value, rgb_array_value, rgb_value
} from "@ras-lights/common/types/mode";
import { EditorContext, pathEquals } from '../editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift, faTimes } from '@fortawesome/free-solid-svg-icons'

//https://css-tricks.com/almanac/properties/b/box-shadow/
const Main = styled.div`
    margin: .25rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    width: fit-content;
    padding: 0.6rem;
    position: relative;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`
const Box = styled.div`
    width: 1rem;
    padding: 2px;
    border-radius: 2px;
    background: grey;
`

interface props {
    config: func_config;
    signatures: signatures;
    path: number[];
    // activate: (x: number[]) => void;
    // Preview: React.FC<{ path: number[] }>;
}

export const FuncValue: React.FC<props> = ({ config, signatures, path }) => {

    const editor = useContext(EditorContext);
    const Preview = editor.get_preview
    const is_active = pathEquals(editor.active_path, path)
    const wrappers = editor.getWrappers(path)

    const mainRef = React.useRef(null)
    const menuRef = React.useRef(null)
    const [mainWidth] = useSize(mainRef)
    const [menuWidth] = useSize(menuRef)


    return (
        <Main
            ref={mainRef}
            style={{ backgroundColor: is_active ? "#cccccc" : "white" }}
            onClick={(ev: React.MouseEvent<HTMLElement>) => {
                ev.preventDefault()
                ev.stopPropagation()
                editor.set_active_path(path)
            }}
        >
            <div
                ref={menuRef}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    position: "absolute",
                    left: `${mainWidth - menuWidth - 5}px`,
                    padding: '.4rem',
                    gap: '.4rem',
                    borderRadius: "2px",
                    backgroundColor: "rgba(255,255,255,0.85)",
                }}>
                {wrappers.length > 0 && (
                    <Box>
                        <FontAwesomeIcon
                            style={{ margin: "auto", display: "block" }}
                            icon={faGift} />
                    </Box>
                )}
                <Box onClick={() => { editor.onClose(path) }}>
                    <FontAwesomeIcon
                        style={{ margin: "auto", display: "block" }}
                        icon={faTimes} />
                </Box>
            </div>
            <Row>
                <p><span style={{ color: "grey" }}>func: </span> {config.name}</p>
                <Preview path={path} />
            </Row>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}>{
                    signatures[config.name].input.map((input, i: number) => {
                        const value = config.params[input.key];
                        if (value.type === "func") {
                            return (<div>
                                <Label>{input.label}:</Label>
                                <FuncValue
                                    key={i}
                                    config={value}
                                    path={[...path, i]}
                                    signatures={signatures}
                                />
                            </div>
                            )
                        }
                        return (<Parameter
                            key={i}
                            config={input}
                            value={value}
                            path={[...path, i]}
                        />)
                    })}</div>
        </Main>
    )
}

interface parameterProps {
    config: input;
    value: mode_param;
    path: number[];
}

const Parameter: React.FC<parameterProps> = ({ config, value, path }) => {

    switch (config.type) {
        case "number":
        case "integer": {
            return <NumberValue
                spec={config as integer_input | range_input}
                value={(value as num_value).value}
                path={path}
            />
        }
        case "boolean": {
            return <BooleanValue
                spec={config as boolean_input}
                value={(value as bool_value).value}
                path={path}
            />

        }
        case "rgb": {
            return <ColorValue
                spec={config as color_input}
                value={(value as rgb_value).value}
                path={path}
            />

        }
        case "rgb[]": {
            return <ColorArrayValue
                spec={config as color_array_input}
                value={(value as rgb_array_value).value}
                path={path}
            />

        }
    }


}