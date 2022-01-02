import React, { useState, useEffect } from 'react';
// import Cron, { CronError } from "react-js-cron"
// import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
// import { Dropdown, IDropdownOption } from '@fluentui/react';
// // import { signatures, } from "@ras-lights/common/types/parameters"
// import { PrimaryButton } from '@fluentui/react/lib/Button';
import Editor from "./schedule-editor"
import cronstrue from 'cronstrue';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faLock } from '@fortawesome/free-solid-svg-icons'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { ISchedule } from '@ras-lights/common/types/schedule';

const Table = styled.table`
    border-collapse: collapse;
    tr:nth-child(even) {background: #DDD};
    tr:nth-child(odd) {background: #FFF};
    margin: 2rem;
`
const Th = styled.th`
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
`
const Td = styled.td`
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
`


interface IReadableSchedule extends ISchedule {
    human: string
}

interface ScheduleProps {
}
const Schedule: React.FC<ScheduleProps> = ({ }) => {


    const [schedules, set_schedules] = useState<IReadableSchedule[]>()
    const [modes, set_modes] = useState<string[]>()
    const [saveError, set_save_error] = useState<string>()
    const [current_schedule, set_current_schedule] = useState<ISchedule | undefined>()

    const deleteSchedule = (i: number) => {
        if (typeof schedules === "undefined")
            return
        console.log(`deleteing schedule ${schedules[i].name}`);
        (async () => {
            const results = await fetch("/api/schedule/", {
                method: 'DELETE',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: schedules[i].name })
            });
            if (results.status !== 200) {
                set_save_error(await results.text())
            }
            await fetchSchedules()
        })()
    }
    const editSchedule = (i: number) => {
        if (typeof schedules === "undefined")
            return
        console.log(`editing schedule ${schedules[i].name}`)
        set_current_schedule(schedules[i])
    }

    const saveSchedule = async (s: ISchedule) => {
        console.log("new schedule: ", s)
        set_current_schedule(s)
        const results = await fetch("/api/schedule/", {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
        });
        if (results.status !== 200) {
            set_save_error(await results.text())
        }
        await fetchSchedules()
    }

    const fetchSchedules = async () => {
        const results = await fetch("/api/schedule/")
        const _schedules: IReadableSchedule[] = await results.json()
        _schedules.forEach(s => { s.human = cronstrue.toString(s.schedule) })
        set_schedules(_schedules.sort((a, b) => (a.name < b.name) ? -1 : 1))
    }

    useEffect(() => {
        if (typeof schedules === "undefined")
            fetchSchedules()
    }, [])

    useEffect(() => {
        if (typeof modes === "undefined") {
            (async () => {
                const response = await fetch("/api/mode/");
                try {
                    const config: any = await response.json();
                    set_modes(["off", ...config.map((x: any) => x.name)])
                } catch (err) {
                    console.log(`fetch("/api/mode/").json() failed with`, err)
                    console.log("This usually means the app is running on a dev box without beign proxied via /nginx-dev.conf")
                }
            })()
        }
    }, [])

    if (typeof schedules === "undefined")
        return (<div><Spinner label="I am definitely loading..." size={SpinnerSize.large} /></div>)

    return (
        <div>
            <Editor
                modes={modes || []}
                schedule={current_schedule}
                save={saveSchedule}
            />
            {saveError && <p style={{ color: "red" }}>Somethig went wrong while saving: {saveError}</p>}

            <Table>
                <colgroup>
                    <col style={{ minWidth: "11rem" }} />
                    <col style={{ minWidth: "11rem" }} />
                    <col style={{ width: "100%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <Th>Name</Th>
                        <Th>Mode</Th>
                        <Th>Schedule</Th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((s, i) => (
                        <tr key={i}>
                            <Td>{s.name}</Td>
                            <Td>{s.mode}</Td>
                            <Td>{s.human}<span style={{ float: "right" }}>
                                <FontAwesomeIcon
                                    style={{ margin: "0 7px" }}
                                    icon={faTrashAlt}
                                    title="Delete"
                                    onClick={() => deleteSchedule(i)}
                                />
                                <FontAwesomeIcon
                                    style={{ margin: "0 7px" }}
                                    icon={faEdit}
                                    title="Edit"
                                    onClick={() => editSchedule(i)}
                                />
                                <FontAwesomeIcon
                                    style={{ margin: "0 7px" }}
                                    title="something"
                                    icon={faLock}
                                />
                            </span></Td>
                        </tr>
                    ))}
                </tbody>

            </Table>


        </div>
    )
}


export default Schedule