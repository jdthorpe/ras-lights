import Datastore from "nedb-promises";
import settings from "./settings";
import { join } from "path";

const app_dir: string =
    (settings.api && settings.api["app-dir"]) || "/var/lib/ras-lights";

export const scheduleStore = Datastore.create(join(app_dir, "schedule.db"));
export const modeStore = Datastore.create(join(app_dir, "modes.db"));
export const adminStore = Datastore.create(join(app_dir, "admin.db"));
