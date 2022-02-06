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
        let canceled = false;
        (async () => {
            if (typeof mode_config === "undefined") {
                const response = await fetch("/api/mode/", {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                });
                if (canceled) return
                const mode_res = await fetch("/api/ctl/")
                if (canceled) return

                try {
                    const mode = await mode_res.json()
                    if (canceled) return
                    const config: show[] = await response.json();
                    if (canceled) return
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
        return () => { canceled = true }
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
            )}
            {/* <pre>{typeof i !== "undefined" ? JSON.stringify(mode_config[i].ui, null, 2) : null}</pre> */}
        </div>
    );
};

export default Modes
