import React, { useState } from 'react';
// import Cron, { CronError } from "react-js-cron"
// import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
// import { Dropdown, IDropdownOption } from '@fluentui/react';
// // import { signatures, } from "@ras-lights/common/types/parameters"
// import { PrimaryButton } from '@fluentui/react/lib/Button';
import Editor from "./schedule-editor"

export interface ISchedule {
    name: string;
    mode: string;
    schedule: string;
}

interface ScheduleProps {
}
const Schedule: React.FC<ScheduleProps> = ({ }) => {


    return (
        <div>

            <Editor
                modes={['a', 'b', 'c']}
                name={"something"}
                mode={'a'}
                schedule={"30 18 * * 1,6"}
                save={(s: ISchedule) => console.log("new schedule: ", s)}
            />

        </div>
    )
}


export default Schedule