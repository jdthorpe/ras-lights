import React, { useState } from 'react';
import styled from "styled-components"
import { Label } from '@fluentui/react/lib/Label';
import { BooleanValue } from './boolean-input';
import { ColorArrayValue, ColorValue } from './color-input';
import {
    input,
    boolean_input,
    integer_input,
    range_input,
    color_input,
    color_array_input,
    signature
} from "common/types/parameters"
import { NumberValue } from './number-input';
import { bool_value, func_config, mode_param, num_value, rgb_array_value, rgb_value } from "common/types/mode";

//https://css-tricks.com/almanac/properties/b/box-shadow/
const Main = styled.div`
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
`

interface props {
    config: func_config;
    signature: signature;
    path: number[];
    activate: (x: number[]) => void;
}

export const FuncValue: React.FC<props> = ({ config, signature, path, activate }) => {

    // const [signature, set_signature] = useState<signature>()

    // useEffect(async ()=>{
    //     if(typeof signature === "undefined"){
    //         set_signature
    //     }
    // },[signature, set_signature])

    return (
        <Main onClick={() => activate(path)}>
            <div><p>Preview</p></div>
            <Label>{config.name}</Label>
            <div>{signature.input.map((input, i) => {
                return (<Parameter
                    config={input}
                    value={config.params[input.key]}
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
                onClick={() => activate(path)}
            />
        }
        case "boolean": {
            return <BooleanValue
                spec={config as boolean_input}
                value={(value as bool_value).value}
                onChanged={() => { alert("func-input says hi") }}
                onClick={() => activate(path)}
            />

        }
        case "rgb": {
            return <ColorValue
                spec={config as color_input}
                value={(value as rgb_value).value}
                onClick={() => activate(path)}
            />

        }
        case "rgb[]": {
            return <ColorArrayValue
                spec={config as color_array_input}
                value={(value as rgb_array_value).value}
                onClick={() => activate(path)}
            />

        }
    }


}