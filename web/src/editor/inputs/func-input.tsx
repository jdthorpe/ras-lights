import React from 'react';
import styled from "styled-components"
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
import {
    bool_value, func_config, mode_param,
    num_value, rgb_array_value, rgb_value
} from "@ras-lights/common/types/mode";

//https://css-tricks.com/almanac/properties/b/box-shadow/
const Main = styled.div`
    margin: .5rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    width: fit-content;
    padding: 1rem;
    display: inline-block;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`

interface props {
    config: func_config;
    signatures: signatures;
    path: number[];
    activate: (x: number[]) => void;
    Preview: React.FC<{ path: number[] }>;
}

export const FuncValue: React.FC<props> = ({ config, signatures, path, activate, Preview }) => {

    return (
        <Main onClick={(ev: React.MouseEvent<HTMLElement>) => {
            ev.preventDefault()
            ev.stopPropagation()
            activate(path)
        }}>
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
                            return <FuncValue
                                key={i}
                                config={value}
                                path={[...path, i]}
                                signatures={signatures}
                                activate={activate}
                                Preview={Preview}
                            />
                        }
                        return (<Parameter
                            key={i}
                            config={input}
                            value={value}
                            path={[...path, i]}
                            activate={activate}
                        />)
                    })}</div>
        </Main>
    )
}

interface parameterProps {
    config: input;
    value: mode_param;
    path: number[];
    activate: (x: number[]) => void;
}

const Parameter: React.FC<parameterProps> = ({ config, value, activate, path }) => {

    switch (config.type) {
        case "number":
        case "integer": {
            return <NumberValue
                spec={config as integer_input | range_input}
                value={(value as num_value).value}
                onChanged={() => { alert("func-input says hi") }}
                activate={() => activate(path)}
            />
        }
        case "boolean": {
            return <BooleanValue
                spec={config as boolean_input}
                value={(value as bool_value).value}
                onChanged={() => { alert("func-input says hi") }}
                activate={() => activate(path)}
            />

        }
        case "rgb": {
            return <ColorValue
                spec={config as color_input}
                value={(value as rgb_value).value}
                activate={() => {

                    console.log("activating?? path", path)
                    activate(path)
                }}
            />

        }
        case "rgb[]": {
            return <ColorArrayValue
                spec={config as color_array_input}
                value={(value as rgb_array_value).value}
                activate={() => activate(path)}
            />

        }
    }


}