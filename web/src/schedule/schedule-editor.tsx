import React, { useState } from 'react';
import Cron, { CronError } from "react-js-cron"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react';
// import { signatures, } from "@ras-lights/common/types/parameters"
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { ISchedule } from "./schedule"

import styled from "styled-components"
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const Row = styled.div`
    display: flex;
    flex-directio: row;
    gap: 1rem;
    align-items: flex-end;
    margin: 1rem;
`

const textboxStyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "15rem" } };
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "10rem" },
};

const defaultValue = '* * * * *'

interface EditScheduleProps {
    modes: string[];
    name?: string;
    mode?: string;
    schedule?: string;
    save: (s: ISchedule) => void;
}
const EditSchedule: React.FC<EditScheduleProps> = ({ modes, name, mode, schedule, save }) => {

    const [cronString, setCronString] = useState<string>(schedule || defaultValue);
    const [cronError, setCronError] = useState<CronError>();
    const [_name, setName] = useState<string | undefined>(name || "");
    const [_mode, setMode] = useState<string | undefined>(mode);
    // const [value, setValue] = useState(defaultValue);
    const disabled = (
        typeof _mode === "undefined" ||
        typeof _name === "undefined" ||
        typeof cronString === "undefined" ||
        typeof cronError !== "undefined" ||
        _mode.length === 0 ||
        _name.length === 0 ||
        cronString.length === 0 ||
        cronString === defaultValue
    )

    return (
        <div
            style={{
                width: "max-content"
            }}
        >
            <Row>
                <TextField
                    label="Schedule Name"
                    value={_name}
                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => setName(newValue)}
                    styles={textboxStyle}
                // errorMessage={errorMessage}
                />
                <Dropdown
                    label="Mode"
                    selectedKey={_mode}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChanged={(option: IDropdownOption<any>, index?: number | undefined) => setMode(option.key as string)}
                    placeholder="Select an mode"
                    options={modes.sort().map(s => ({ key: s, text: s }))}
                    styles={dropdownStyles}
                />
                <PrimaryButton
                    style={{ marginLeft: "auto" }}
                    onClick={() => save({ name: _name!, mode: _mode!, schedule: cronString })}
                    disabled={disabled}
                >Save</PrimaryButton>
            </Row>
            <Row>
                <Cron value={cronString} setValue={setCronString} onError={setCronError} />
            </Row>
        </div>
    )
}



export default EditSchedule