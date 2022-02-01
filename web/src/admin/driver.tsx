import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components"
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Label } from '@fluentui/react/lib/Label';
import { channel } from 'shared/types/admin';
import { IDriver } from 'shared/types/admin';
import { IconButton } from '../utils/icon-button';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import equal from "fast-deep-equal"
import { Number } from "../utils/NumberInput"

const Row = styled.div`
    display: flex;
    flex-direction: Row;
    gap: 1rem;
`

const PIN_MODE = ["PWM0", "PWM1", "PCM_DOUT", "SPI0-MOSI"];

const Driver: React.FC<{ driver?: IDriver }> = () => {

    const [driver, set_driver] = useState<IDriver>()
    const [modified, set_modified] = useState(false)
    // sensible(?) defaults
    const [dma, set_dma] = useState<number>(10)
    const [frequency, set_freq] = useState<number>(800000)
    const [channels, set_channels] = useState<channel[]>([])

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/driver/")
                const driver: IDriver = await res.json()
                if (driver === null) {
                    set_driver({ frequency: 800000, dma: 10, channels: [] })
                    return
                }
                set_driver(driver)
                set_freq(driver.frequency)
                set_channels(driver.channels)
                set_dma(driver.dma)
            } catch (err) {
                console.log("dB driver error: ", err)
            }
        })()
    }, [])

    const update_channel = useCallback((ch: channel, i: number) => {
        set_channels([...channels!.slice(0, i), ch, ...channels!.slice(i + 1),
        ])
    }, [channels])

    useEffect(() => {
        set_modified(!equal(driver, { frequency, dma, channels }))
    }, [driver, frequency, dma, channels])

    const save = useCallback(async () => {
        const driver: IDriver = { frequency, dma, channels }
        await fetch("/api/driver/", {
            method: "POST",
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driver)
        })
        set_driver(driver)
    }, [frequency, dma, channels])

    const add = useCallback(() => {
        const ch: channel = {
            gpio: PINS[channels.length][0],
            count: 1,
            brightness: 255,
            type: STRIP_TYPE[0],
            invert: false,
            reverse: false,
        }
        set_channels([...channels, ch])
    }, [channels])

    const del = useCallback(() => {
        set_channels(channels.slice(0, -1))
    }, [channels])

    if (!driver)
        return (<div><p>Loading...</p></div>)

    return <div>
        <Row style={{ alignItems: "flex-end" }}>
            <h2>Driver Settings</h2>
            <p style={{ color: "grey" }} ><a href="https://github.com/dsyomichev/rpi-ws281x-led#driver-configuration">See the <span style={{ fontFamily: "monospace" }}>rpi-ws281x-led</span> library for details</a></p>
        </Row>
        <Row>
            <Number label="Frequency" min={0} value={frequency} onChange={set_freq} />
            <Number label="dma" value={dma} min={0} onChange={set_dma} />
            <PrimaryButton
                label="Save"
                onClick={save}
                disabled={!modified}
                style={{ alignSelf: "flex-end", marginLeft: "auto" }}>Save</PrimaryButton>
        </Row>
        {
            channels && channels.map((ch, i) => (
                <Row key={i}>
                    <Channel pins={PINS[i]} channel={ch} onChange={(x) => update_channel(x, i)} />
                    <div>
                        <Label>Pin&nbsp;Mode</Label>
                        <p>{PIN_MODE[i]}</p>
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        {i === (channels.length - 1) && i < 3 &&
                            <IconButton
                                onClick={add}
                                title="Add Strand"
                                // style={{ color: disableSave ? "#dddddd" : "black" }}
                                icon={faPlus}
                            />
                        }
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        {i === (channels.length - 1) && i > 0 &&
                            <IconButton
                                onClick={del}
                                title="Delete strand"
                                // style={{ color: disableSave ? "#dddddd" : "black" }}
                                icon={faTrashAlt}
                            />
                        }
                    </div>
                </Row>
            ))
        }

    </div >
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
    const [type, set_type] = useState(channel.type)
    const [invert, set_invert] = useState<boolean>(channel.invert)
    const [reverse, set_reverse] = useState<boolean>(channel.reverse)

    useEffect(() => {
        onChange({ brightness, count, gpio, type, invert, reverse })
    }, [brightness, count, gpio, type, invert, reverse])

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
        <Number label="Brightness" value={brightness} min={0} max={255} onChange={set_brightness} />
        <Number label="Count" value={count} min={0} onChange={set_count} />
        <Toggle label="Invert" checked={invert} onChange={(e: any, checked?: boolean) => typeof checked !== "undefined" && set_invert(checked)} />
        <Toggle label="Reverse" checked={reverse} onChange={(e: any, checked?: boolean) => typeof checked !== "undefined" && set_reverse(checked)} />
        <Dropdown
            label="Strip Type"
            styles={{ root: { minWidth: "11rem", maxWidth: "11rem" } }}
            options={STRIP_TYPE.map(m => ({ key: m, text: m }))}
            selectedKey={type as string}
            onChange={
                (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
                    option && set_type(option.key)
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