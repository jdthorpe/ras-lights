import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components"
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { channel, ISTRIP_TYPE } from 'shared/types/admin';
import { Driver as IDriver } from 'shared/types/admin';
import { IconButton } from '../utils/icon-button';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

const Row = styled.div`
    display: flex;
    flex-direction: Row;
    gap: 1rem;
`

const default_driver: IDriver = {
    frequency: 800000,
    channels: [
        {
            gpio: 18,
            count: 8,
            type: "WS2811_STRIP_GRB",
            brightness: 64,
        },
        {
            gpio: 13,
            count: 339,
            type: "SK6812_STRIP_GRBW",
            brightness: 255,
        },
    ],
}


const Driver: React.FC<{ driver?: IDriver }> = () => {

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/driver/")
                const driver = await res.json()
                console.log("DB driver: ", driver)
            } catch (err) {
                console.log("dB driver error: ", err)

            }
        })()

    }, [])

    const [freq, set_freq] = useState<number>(800000)
    const [channels, set_channels] = useState<channel[]>(default_driver.channels)

    const update_channel = useCallback((ch: channel, i: number) => {
        set_channels([
            ...channels!.slice(0, i),
            ch,
            ...channels!.slice(i + 1),
        ])

    }, [channels])

    return <div>
        <h2>Strip Settings</h2>
        <Row>
            <Number label="Frequency" min={0} value={freq} onChange={set_freq} />
            <DefaultButton
                onClick={() => alert("save")}
                style={{ alignSelf: "flex-end", marginLeft: "auto" }}>Save</DefaultButton>
        </Row>
        {channels && channels.map((ch, i) => (
            <>
                <Row>
                    <Channel pins={PINS[i]} channel={ch} onChange={(x) => update_channel(x, i)} />

                    <div style={{ alignSelf: "flex-end" }}>
                        {i === (channels.length - 1) && i < 3 &&
                            <IconButton
                                onClick={() => alert("plus")}
                                title="Add Strand"
                                // style={{ color: disableSave ? "#dddddd" : "black" }}
                                icon={faPlus}
                            />
                        }
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        {i === (channels.length - 1) && i > 0 &&
                            <IconButton
                                onClick={() => alert("trash")}
                                title="Delete strand"
                                // style={{ color: disableSave ? "#dddddd" : "black" }}
                                icon={faTrashAlt}
                            />
                        }
                    </div>
                </Row>
            </>
        ))}

    </div>
}

interface IChannel {
    pins: number[];
    channel: channel;
    onChange: (c: channel) => void;
}

const Channel: React.FC<IChannel> = ({ pins, channel, onChange }) => {

    const [brightness, set_brightness] = useState<number>(channel.brightness)
    const [count, set_count] = useState<number>(channel.count)
    const [gpio, set_gpio] = useState<number>(channel.gpio)
    const [type, set_type] = useState<ISTRIP_TYPE>(channel.type)

    useEffect(() => {
        console.log("updated channel values")
        onChange({ brightness, count, gpio, type })
    }, [brightness, count, gpio, type])

    useEffect(() => {
        set_brightness(channel.brightness)
        set_count(channel.count)
        set_gpio(channel.gpio)
        set_type(channel.type)
    }, [channel])

    return (<>
        <Dropdown
            label="GPIO"
            styles={{ root: { minWidth: "5rem", maxWidth: "5rem" } }}
            options={pins.map(m => ({ key: m, text: `${m}` }))}
            selectedKey={gpio}
            onChange={
                (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
                    event && option && set_gpio(option.key as number)
                }
            }
        />
        <Number
            label="Brightness"
            value={brightness}
            min={0}
            max={255}
            onChange={set_brightness}
        />
        <Number
            label="Count"
            value={count}
            min={0}
            onChange={set_count}
        />
        <Dropdown
            label="Strip Type"
            styles={{ root: { minWidth: "15rem", maxWidth: "20rem" } }}
            options={STRIP_TYPE.map(m => ({ key: m, text: m }))}
            selectedKey={type}
            onChange={
                (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
                    option && set_type(option.key as ISTRIP_TYPE)
                }
            }
        />
    </>)
}


// TODO: move to shared
const STRIP_TYPE = [
    "WS2811_STRIP_RGB",
    "WS2811_STRIP_RBG",
    "WS2811_STRIP_GBR",
    "WS2811_STRIP_GRB",
    "WS2811_STRIP_BRG",
    "WS2811_STRIP_BGR",
    "K6812_STRIP_RGBW",
    "SK6812_STRIP_RBGW",
    "SK6812_STRIP_GBRW",
    "SK6812_STRIP_GRBW",
    "SK6812_STRIP_BRGW",
    "SK6812_STRIP_BGRW",
];


interface NumberProps {
    label: string;
    min?: number;
    max?: number;
    value?: number;
    onChange: { (x: number): void };
}
const Number: React.FC<NumberProps> = ({ label, min, max, value, onChange }) => {

    const [_value, set_value] = React.useState(`${value}`);
    const [error, set_error] = React.useState<string | undefined>();

    useEffect(() => {
        set_value((typeof value === "undefined" || isNaN(value)) ? "" : `${value}`)
    }, [value])

    const _onChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            set_value(newValue || '');
            let val = newValue ? parseInt(newValue) : NaN
            onChange(val)
            if (newValue) {
                if (isNaN(val)) return set_error(`Not an integer`)
                if (typeof min === "number" && val < min) return set_error(`Minimum: ${min}`)
                else if (typeof max === "number" && val > max) return set_error(`Maximum: ${max}`)
                else set_error(undefined)
            }
        },
        [],
    );

    return <TextField
        styles={{ root: { maxWidth: "5rem" } }}
        label={label}
        value={_value}
        onChange={_onChange}
        errorMessage={error}
    />
}

const PINS = [
    [12, 18, 40, 52],
    [13, 19, 41, 45, 53],
    [21, 31],
    [10, 38],
]


const pin_map = {
    12: "PWM0",
    18: "PWM0",
    40: "PWM0",
    52: "PWM0",
    13: "PWM1",
    19: "PWM1",
    41: "PWM1",
    45: "PWM1",
    53: "PWM1",
    21: "PCM_DOUT",
    31: "PCM_DOUT",
    10: "SPI0-MOSI",
    38: "SPI0-MOSI",
}

export default Driver