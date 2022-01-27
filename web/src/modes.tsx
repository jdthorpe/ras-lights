import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { UI } from './ui';
import { show } from "shared/types/mode";

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};

const Modes: React.FC = () => {

    // dropdown sate
    const [item_list, set_item_list] = useState<IDropdownOption[]>([]);
    const [active_key, set_active_key] = useState<string>();
    // available modes
    const [mode_config, set_mode_config] = useState<show[]>();
    // active mode
    const [mode, set_mode] = useState<show>();

    useEffect(() => {
        (async () => {
            if (typeof mode_config === "undefined") {
                const response = await fetch("/api/mode/", {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                });
                const mode_res = await fetch("/api/ctl/")

                try {
                    const mode = await mode_res.json()
                    const config: show[] = await response.json();
                    set_mode_config(config)
                    const il: IDropdownOption[] = config.map(x => ({ key: x.name, text: x.name }))
                    set_item_list(il)
                    if (typeof mode.mode === "string") {
                        const indx = config.findIndex(x => x.name === mode.mode)
                        if (indx >= 0) {
                            const conf: show = { ...config[indx] }
                            if (conf.ui) {
                                conf.ui = [...conf.ui]
                                for (let [key, value] of Object.entries(mode.updates)) {
                                    let i = conf.ui.findIndex(u => u.key === key)
                                    if (typeof i !== undefined)
                                        // @ts-ignore
                                        conf.ui[i] = { ...conf.ui[i], "default": value }
                                }
                            }
                            set_mode(conf)
                            set_active_key(il[indx].key as string)
                        } else {
                            console.log(`unknown mode ${mode.mode}`)

                        }
                    }

                } catch (err) {
                    console.log(`fetch("/api/mode/").json() failed with`, err)
                    console.log("This usually means the app is running on a dev box without beign proxied via /nginx-dev.conf")
                }
            }
        })()
    }, [mode_config, set_mode_config])


    const cb = useCallback(async (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
        if (mode_config && option && typeof index === "number") {
            fetch(`/api/mode/${option.key}`)
            // set_mode_number(index)
            set_mode(mode_config[index])
            set_active_key(option.key as string)
        }
    }, [mode_config])

    return (
        <div style={{ margin: "1.5rem" }}>
            <Dropdown
                placeholder="Select a Light Mode"
                label="Light Mode"
                selectedKey={active_key}
                options={item_list}
                styles={dropdownStyles}
                onChange={cb} />

            {mode && mode.ui && (
                <UI ui={mode.ui} />
                // mode_config[i].ui.map((data: any) =>
                //     <div key={i} style={{ margin: 10 }}>
                //         <UI_instance ui={data} />
                //     </div>)
            )}
            {/* <pre>{typeof i !== "undefined" ? JSON.stringify(mode_config[i].ui, null, 2) : null}</pre> */}
        </div>
    );
};

export default Modes


// let x = [{ "name": "My Show", "def": { "type": "func", "name": "Dimmer", "params": { "main": { "type": "func", "name": "Gradient", "params": { "a": { "type": "rgb", "value": [255, 0, 0], "ui": { "type": "color-picker", "label": "First Color", "key": "y3a4UnV8", "path": [0, 0], "default": [255, 0, 0] } }, "b": { "type": "rgb", "value": [0, 0, 255] } } }, "intensity": { "type": "number", "value": 90, "ui": { "type": "slider", "label": "Brightnesssss", "key": "YgHWYTQE", "path": [1], "default": 90, "max": 100, "min": 0 } } } }, "ui": [{ "type": "color-picker", "label": "First Color", "key": "y3a4UnV8", "path": [0, 0], "default": [255, 0, 0] }, { "type": "slider", "label": "Brightnesssss", "key": "YgHWYTQE", "path": [1], "default": 90, "max": 100, "min": 0 }] }, { "name": "Dynamic Rainbow", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [0, 8, 255] }, "b": { "type": "rgb", "value": [255, 230, 0] }, "fade": { "type": "number", "value": 1500 }, "hold": { "type": "number", "value": 100 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [132, 0, 255] }, "b": { "type": "rgb", "value": [255, 51, 0] }, "fade": { "type": "number", "value": 2000 }, "hold": { "type": "number", "value": 100 } } } } } }, { "name": "limon", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "rgb", "value": [0, 255, 8] }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [255, 200, 0] }, "b": { "type": "rgb", "value": [0, 0, 255], "ui": { "type": "color-picker", "label": "Third Color", "key": "usOgBIcj", "path": [1, 1], "default": [0, 0, 255] } }, "fade": { "type": "number", "value": 1000 }, "hold": { "type": "number", "value": 1000 } } } } }, "ui": [{ "type": "color-picker", "label": "Third Color", "key": "usOgBIc", "path": [1, 1], "default": [0, 0, 255] }] }, { "name": "Red-Blue", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [0, 8, 255] }, "b": { "type": "rgb", "value": [255, 0, 0] }, "fade": { "type": "number", "value": 1000 }, "hold": { "type": "number", "value": 1000 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [255, 0, 0] }, "b": { "type": "rgb", "value": [0, 0, 255] }, "fade": { "type": "number", "value": 1000 }, "hold": { "type": "number", "value": 1000 } } } } } }, { "name": "Rotating Rainbow", "def": { "type": "func", "name": "Rotate", "params": { "in": { "type": "func", "name": "Rainbow Stripes", "params": { "n": { "type": "integer", "value": 339 } } }, "period": { "type": "number", "value": 15 }, "backwards": { "type": "boolean", "value": true, "ui": { "type": "toggle", "label": "Reverse Direction", "key": "D7ByZxTq", "path": [2], "default": true } } } }, "ui": [{ "type": "toggle", "label": "Reverse Direction", "key": "D7ByZxTq", "path": [2], "default": true }] }, { "name": "Deep Sea", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [255, 0, 221] }, "b": { "type": "rgb", "value": [0, 149, 255] }, "fade": { "type": "number", "value": 2500 }, "hold": { "type": "number", "value": 100 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [47, 0, 255] }, "b": { "type": "rgb", "value": [81, 255, 0] }, "fade": { "type": "number", "value": 3500 }, "hold": { "type": "number", "value": 100 } } } } }, "ui": [] }, { "name": "Sleep tight", "def": { "type": "func", "name": "Dimmer", "params": { "main": { "type": "func", "name": "Solid", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [0, 149, 255] }, "b": { "type": "rgb", "value": [22, 2, 199] }, "fade": { "type": "number", "value": 3000 }, "hold": { "type": "number", "value": 3000 } } } } }, "intensity": { "type": "number", "value": 50, "ui": { "type": "slider", "label": "Brightness", "key": "irSLn2Wj", "path": [1], "default": 50, "max": 100, "min": 0 } } } }, "ui": [{ "type": "slider", "label": "Brightness", "key": "irSLn2Wj", "path": [1], "default": 50, "max": 100, "min": 0 }] }, 
// { "name": "Quolor", "def": { "type": "func", "name": "Dimmer", "params": { "main": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [0, 255, 238], "ui": { "type": "color-picker", "label": "Left 1", "key": "j4qWL5xl", "path": [0, 0, 0], "default": [0, 255, 238] } }, "b": { "type": "rgb", "value": [0, 0, 255], "ui": { "type": "color-picker", "label": "Left 2", "key": "j4qWL5xl", "path": [0, 0, 1], "default": [0, 0, 255] } }, "fade": { "type": "number", "value": 2000 }, "hold": { "type": "number", "value": 5000 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [255, 0, 0], "ui": { "type": "color-picker", "label": "Right 1", "key": "j4qWL5xl", "path": [0, 1, 0], "default": [255, 0, 0] } }, "b": { "type": "rgb", "value": [255, 115, 0], "ui": { "type": "color-picker", "label": "Right 2", "key": "j4qWL5xl", "path": [0, 1, 1], "default": [255, 115, 0] } }, "fade": { "type": "number", "value": 2000 }, "hold": { "type": "number", "value": 3000 } } } } }, "intensity": { "type": "number", "value": 90 } } }
// , "ui": [] }, { "name": "Seahawks", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [26, 255, 0] }, "b": { "type": "rgb", "value": [0, 0, 255] }, "fade": { "type": "number", "value": 2000 }, "hold": { "type": "number", "value": 3000 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [17, 0, 255] }, "b": { "type": "rgb", "value": [43, 255, 0] }, "fade": { "type": "number", "value": 3500 }, "hold": { "type": "number", "value": 2500 } } } } }, "ui": [] }, { "name": "Dynamic Rainbow 2", "def": { "type": "func", "name": "Gradient", "params": { "a": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [149, 0, 255] }, "b": { "type": "rgb", "value": [255, 230, 0] }, "fade": { "type": "number", "value": 1500 }, "hold": { "type": "number", "value": 100 } } }, "b": { "type": "func", "name": "Alternate", "params": { "a": { "type": "rgb", "value": [255, 166, 0] }, "b": { "type": "rgb", "value": [0, 166, 255] }, "fade": { "type": "number", "value": 2000 }, "hold": { "type": "number", "value": 100 } } } } } }, { "name": "UI Test 2", "def": { "type": "func", "name": "Dimmer", "params": { "main": { "type": "func", "name": "Rotate", "params": { "in": { "type": "func", "name": "Gradient", "params": { "a": { "type": "rgb", "value": [255, 0, 0] }, "b": { "type": "rgb", "value": [0, 0, 255], "ui": { "type": "color-picker", "label": "Second Color", "key": "u0JnIZmP", "path": [0, 0, 1], "default": [0, 0, 255] } } } }, "period": { "type": "number", "value": 1 }, "backwards": { "type": "boolean", "value": false, "ui": { "type": "toggle", "label": "Reverse Direction", "key": "HObK088I", "path": [0, 2], "default": false } } } }, "intensity": { "type": "number", "value": 90, "ui": { "type": "slider", "label": "Brightness", "key": "xWKnxU6X", "path": [1], "default": 90, "min": 0, "max": 100 } } } }, "ui": [{ "type": "color-picker", "label": "Second Color", "key": "u0JnIZmP", "path": [0, 0, 1], "default": [0, 0, 255] }, { "type": "toggle", "label": "Reverse Direction", "key": "HObK088I", "path": [0, 2], "default": false }, { "type": "slider", "label": "Brightness", "key": "xWKnxU6X", "path": [1], "default": 90, "min": 6, "max": 100 }] }]
