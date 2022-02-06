import React from 'react';
import styled from "styled-components"
import cc from "color-convert"
import { Label } from '@fluentui/react/lib/Label';
import { rgb, rgbw } from 'shared/types/mode';

import { rgbw_input, rgbw_array_input } from "shared/types/parameters"

const WrappedRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: .7rem;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
`

const SIZE = "2rem"
const H_SIZE = "1rem"

const ColorBox = styled.div<{ height: string, width: string, color: string }>`
    height: ${(props) => props.height};
    width: ${(props) => props.width};
    backgroundColor: #${props => props.color};
    borderStyle: "solid";
    borderWidth: "1px";
    borderRadius: "2px";
    borderColor: "black";
`

/*
interface color_value_props {
    spec: color_input;
    value: rgbw;
}

export const RGBWValue: React.FC<color_value_props> = ({ spec, value }) => {
    const w = value[3].toString(16)
    return (
        <div
            style={{
                display: 'inline-block',
                margin: "0 .5rem",
            }}>
            <Label>{spec.label}</Label>
            <Col>
                <ColorBox height={H_SIZE} width={SIZE} color={`#${w}${w}${w}`} />
                <ColorBox height={H_SIZE} width={SIZE} color={cc.rgb.hex(value.slice(0, 3) as rgb)} />
            </Col>
        </div>
    )
}

*/


export const RGBW: React.FC<{ color: rgbw }> = ({ color }) => {
    const w = color[3].toString(16)
    return (
        <Col>
            <ColorBox height={H_SIZE} width={SIZE} color={`#${w}${w}${w}`} />
            <ColorBox height={H_SIZE} width={SIZE} color={cc.rgb.hex(color.slice(0, 3) as rgb)} />
        </Col>
    )
}

export const RGBWArray: React.FC<{ colors: rgbw[] }> = ({ colors }) => {
    return (
        <WrappedRow >
            {colors.map((color: rgbw, i) => {
                const w = color[3].toString(16)
                return (
                    <Col key={i}>
                        <ColorBox height={H_SIZE} width={SIZE} color={`#${w}${w}${w}`} />
                        <ColorBox height={H_SIZE} width={SIZE} color={cc.rgb.hex(color.slice(0, 3) as rgb)} />
                    </Col>
                )
            })}
        </WrappedRow>
    )
}

interface color_value_props {
    spec: rgbw_input;
    value: rgbw;
}

export const RGBWValue: React.FC<color_value_props> =
    ({ value: color, spec }) => {
        return (
            <>
                <Label>{spec.label}</Label>
                <RGBW color={color} />
            </>
        )
    }


interface color_array_value_props {
    spec: rgbw_array_input;
    value: rgbw[];
}


export const RGBWArrayValue: React.FC<color_array_value_props> =
    ({ value: colors, spec }) => {
        return (
            <>
                <Label>{spec.label}</Label>
                <RGBWArray colors={colors} />
            </>
        )
    }
