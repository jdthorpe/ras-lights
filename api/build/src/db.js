"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modeStore = exports.scheduleStore = void 0;
const nedb_promises_1 = __importDefault(require("nedb-promises"));
const settings_1 = __importDefault(require("./settings"));
const path_1 = require("path");
const app_dir = (settings_1.default.api && settings_1.default.api["app-dir"]) || "/var/lib/ras-lights";
exports.scheduleStore = nedb_promises_1.default.create((0, path_1.join)(app_dir, "schedule.db"));
exports.modeStore = nedb_promises_1.default.create((0, path_1.join)(app_dir, "modes.db"));
