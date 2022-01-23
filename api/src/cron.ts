import nodeSchedule, { Job } from "node-schedule";
import { setMode } from "./mode";
import { scheduleStore } from "./db";
import { ISchedule } from "shared/types/schedule";

let JOBS: { [key: string]: Job } = {};

// startup:
reload();

export function cancel(name: string): void {
    const job = JOBS[name];
    job && job.cancel();
    delete JOBS[name];
}

export async function reload(): Promise<void> {
    Object.entries(nodeSchedule.scheduledJobs).forEach(([name, job]) => {
        job.cancel();
        delete JOBS[name];
    });
    const schedules: ISchedule[] = await scheduleStore.find({});
    for (let s of schedules) schedule_mode(s);
}

export function schedule_mode(schedule: ISchedule): void {
    const job = JOBS[schedule.name];
    job && job.cancel();
    JOBS[schedule.name] = nodeSchedule.scheduleJob(
        schedule.schedule,
        function () {
            setMode(schedule.mode);
        }
    );
}

export function get_schedules(): { [key: string]: Date } {
    return Object.fromEntries(
        Object.entries(JOBS).map(([name, job]) => [name, job.nextInvocation()])
    );
}
