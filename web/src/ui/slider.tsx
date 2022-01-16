import React, { useEffect, useState } from 'react';
import debounce from "lodash.debounce"
import { Label } from '@fluentui/react/lib/Label';
import { Slider } from '@fluentui/react/lib/Slider';
import { int_value, num_value, value_instance } from '@ras-lights/common/types/mode';
import { range_input, integer_input, input } from '@ras-lights/common/types/parameters';
import { ui_slider } from '@ras-lights/common/types/user-input';
import { set_update } from "./utils"

export const SliderInput: React.FC<{ ui: ui_slider }> = ({ ui }) => {

    const onChange = React.useCallback(debounce((value: number) => {
        set_update(ui.key, value)
    }, 25), [ui]);

    return (
        <div style={{ minWidth: 200, maxWidth: 300 }} >
            <Label>{ui!.label}</Label>
            <Slider
                min={ui!.min}
                max={ui!.max}
                // step={ ui!.min - ui!.max + 1 : undefined}
                // value={value.value}
                defaultValue={ui.default}
                showValue={false}
                onChange={onChange}
            // snapToStep={value.type === "integer"}
            />
        </div>
    )
}

interface ConfigProps {
    el: int_value | num_value;
    spec: integer_input | range_input;
    onChange: (ui: Partial<ui_slider>) => void;
}

export function default_slider_config(
    spec: input,
    el: value_instance,
): Partial<ui_slider> {

    if (spec.type === "number" || spec.type === "integer") {
        let ui: ui_slider | undefined = el.ui as ui_slider
        return {
            max: (ui && typeof ui.max !== "undefined") ? ui.max : spec.max,
            min: (ui && typeof ui.min !== "undefined") ? ui.min : spec.min
        }
    }
    return {}
}

export const SliderConfig: React.FC<ConfigProps> = ({ el, spec, onChange }) => {

    const [_el, set_el] = useState<value_instance>()
    const [_spec, set_spec] = useState<input>()

    useEffect(() => {
        if (el !== _el || spec !== _spec) {
            set_el(el)
            set_spec(spec)
        }
    }, [el, spec])

    return (
        <>
            <Slider
                ranged
                label="Input Range"
                min={spec.min}
                max={spec.max}
                value={(el.ui && typeof el.ui.max !== "undefined") ? el.ui.max : spec.max}
                lowerValue={(el.ui && typeof el.ui.min !== "undefined") ? el.ui.min : spec.min}
                // defaultValue={spec.max}
                // defaultLowerValue={spec.min}
                onChange={(_: unknown, range?: [number, number]) => {
                    if (range)
                        onChange({ min: range[0], max: range[1] })
                }}
            />
            {/* <pre>{JSON.stringify(el, null, 2)}</pre> */}
        </>

    )
}


