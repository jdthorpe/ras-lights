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
    gap: 5px;
`

export const HalfColorBox = styled.div.attrs<{ color: string }>(props => ({
    style: { backgroundColor: props.color }
}))`
    height: 18px;
    width: 32px;
    border-style: solid;
    border-width: 1px;
    border-radius: 2px;
    border-color: black;
    box-sizing: border-box;
`

export const ColorBox = styled.div.attrs<{ color: string }>(props => ({
    style: { backgroundColor: props.color }
}))`
    height: 32px;
    width: 32px;
    border-style: solid;
    border-width: 1px;
    border-radius: 2px;
    border-color: black;
    box-sizing: border-box;
`

export const RGBW: React.FC<{ color: rgbw }> = ({ color }) => {
    const w = color[3].toString(16)
    return (
        <Col>
            <HalfColorBox color={`#${w}${w}${w}`} />
            <HalfColorBox color={cc.rgb.hex(color.slice(0, 3) as rgb)} />
        </Col>
    )
}

export const RGBWArray: React.FC<{ colors: rgbw[] }> = ({ colors }) => {
    try {
        return (
            <WrappedRow >
                {colors.map((color: rgbw, i) => {
                    const w = color[3].toString(16)
                    return (
                        <Col key={i}>
                            <HalfColorBox color={`${w}${w}${w}`} />
                            <HalfColorBox color={cc.rgb.hex(color.slice(0, 3) as rgb)} />
                        </Col>
                    )
                })}
            </WrappedRow>
        )
    } catch (e) {
        console.log(e)
        return <>something went wrong</>
    }
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

