"use strict";
// initialize the modes database
// usage:
// cd api
// sudo node api/build/__init__.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./src/db");
const default_modes_json_1 = __importDefault(require("./default-modes.json"));
(async () => {
    for (let [name, def] of Object.entries(default_modes_json_1.default)) {
        await db_1.modeStore.update({ name }, { name, def }, { upsert: true });
    }
})();
