import React, { useState, useEffect } from 'react';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import JSONViewer from 'react-json-view'

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
    { key: 'apple', text: 'Apple' },
    { key: 'banana', text: 'Banana' },
    { key: 'orange', text: 'Orange' },
    { key: 'grape', text: 'Grape' },
];

const Modes: React.FC = () => {

    const [item, set_item] = useState<IDropdownOption>();
    const [item_list, set_item_list] = useState<IDropdownOption[]>([]);
    const [mode_config, set_mode_config] = useState<any>();

    useEffect(() => {
        (async () => {
            if (typeof mode_config === "undefined") {
                const response = await fetch("/mode/", {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                });
                try {
                    const config = await response.json();
                    set_mode_config(config)
                    const il: IDropdownOption[] = []
                    for (let [mode, def] of Object.entries(config))
                        il.push({ key: mode, text: mode })
                    console.log("il: ", il)
                    set_item_list(il)

                } catch (err) {
                    console.log(`fetch("/mode/").json() failed with`, err)
                    console.log("This usually means the app is running on a dev box without beign proxied via /nginx-dev.conf")
                }
            }
        })()
    }, [mode_config, set_mode_config])

    useEffect(() => {
        (async () => {
            try {
                item?.key &&
                    await fetch(`/mode/${item.key}`)
            } catch (err) {
                console.log("failed to set mode with error", err)

            }

        })()
    }, [item])


    return (
        <>
            <Dropdown
                placeholder="Select a Light Mode"
                label="Light Mode"
                options={item_list}
                styles={dropdownStyles}
                onChanged={(option: IDropdownOption, index?: number) => set_item(option)}
            />
            {item && (<div style={{ margin: "1rem" }}>
                <JSONViewer
                    displayObjectSize={false}
                    displayDataTypes={false}
                    name="Mode"
                    src={mode_config[item.key]}
                />
            </div>)}
        </>
    );
};

export default Modes