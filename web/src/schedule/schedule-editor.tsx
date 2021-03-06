import React, { useState } from 'react';
import styled from "styled-components"
import Cron, { CronError } from "react-js-cron"
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { ISchedule } from 'shared/types/schedule';
import cronstrue from 'cronstrue';

// import 'antd/dist/antd.min.css'; // required by cron

const Row = styled.div`
    display: flex;
    flex-directio: row;
    gap: 1rem;
    align-items: flex-end;
    margin: 0 1rem .6rem 1rem;
`

const textboxStyle: Partial<ITextFieldStyles> = { fieldGroup: { width: "15rem" } };
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "10rem" },
};

const defaultValue = '* * * * *'

interface EditScheduleProps {
    modes: string[];
    schedule?: ISchedule;
    save: (s: ISchedule) => void;
}
const EditSchedule: React.FC<EditScheduleProps> = ({ modes, schedule, save }) => {

    const [_schedule, set_schedule] = useState(schedule)

    const [cronString, setCronString] = useState<string>(schedule?.schedule || defaultValue);
    const [cronError, setCronError] = useState<CronError>();
    const [name, setName] = useState<string | undefined>(schedule?.name || "");
    const [mode, setMode] = useState<string | undefined>(schedule?.mode);

    if (typeof schedule !== "undefined" && !Object.is(_schedule, schedule)) {
        // respond to the outside world
        set_schedule(schedule)
        setMode(schedule.mode)
        setName(schedule.name)
        setCronString(schedule?.schedule)
        setCronError(undefined)
    }

    const disabled = (
        typeof mode === "undefined" ||
        typeof name === "undefined" ||
        typeof cronString === "undefined" ||
        typeof cronError !== "undefined" ||
        mode.length === 0 ||
        name.length === 0 ||
        cronString.length === 0 ||
        cronString === defaultValue
    )

    return (
        <div
            style={{
                backgroundColor: "#dddddd",
            }}
        >

            <div
                style={{
                    width: "max-content",
                    paddingTop: ".5rem",
                }}
            >
                <Row>
                    <TextField
                        label="Schedule Name"
                        value={name}
                        onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => setName(newValue)}
                        styles={textboxStyle}
                    />
                    <Dropdown
                        label="Mode"
                        selectedKey={mode}
                        onChange={(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any>, index?: number | undefined) => option && setMode(option.key as string)}
                        placeholder="Select mode"
                        options={modes.sort().map(s => ({ key: s, text: s }))}
                        styles={dropdownStyles}
                    />
                    <PrimaryButton
                        style={{ marginLeft: "auto" }}
                        onClick={() => save({ name: name!, mode: mode!, schedule: cronString })}
                        disabled={disabled}
                    >Save</PrimaryButton>
                </Row>
                <Row>
                    <Cron value={cronString} setValue={setCronString} onError={setCronError} />
                </Row>
                <Row>
                    <p style={{ marginTop: 0 }}>{cronstrue.toString(cronString)} </p>
                </Row>
            </div>
        </div>
    )
}



export default EditSchedule