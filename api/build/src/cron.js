"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_schedules = exports.schedule_mode = exports.reload = exports.cancel = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const mode_1 = require("./mode");
const db_1 = require("./db");
let JOBS = {};
// startup:
console.log(`[STARTUP] loading cron jobs`);
reload();
function cancel(name) {
    const job = JOBS[name];
    job && job.cancel();
    delete JOBS[name];
}
exports.cancel = cancel;
async function reload() {
    Object.entries(node_schedule_1.default.scheduledJobs).forEach(([name, job]) => {
        job.cancel();
        delete JOBS[name];
    });
    const schedules = await db_1.scheduleStore.find({});
    for (let s of schedules)
        schedule_mode(s);
}
exports.reload = reload;
function schedule_mode(schedule) {
    const job = JOBS[schedule.name];
    job && job.cancel();
    JOBS[schedule.name] = node_schedule_1.default.scheduleJob(schedule.schedule, function () {
        (0, mode_1.setMode)(schedule.mode);
    });
}
exports.schedule_mode = schedule_mode;
function get_schedules() {
    return Object.fromEntries(Object.entries(JOBS).map(([name, job]) => [name, job.nextInvocation()]));
}
exports.get_schedules = get_schedules;
