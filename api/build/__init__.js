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
    const count = await db_1.modeStore.count({});
    if (count) {
        console.log(`There aer aleady ${count} modes`);
    }
    else {
        for (let show of default_modes_json_1.default) {
            console.log(`Creating mode ${show.name}`);
            await db_1.modeStore.update({ name: show.name }, show, { upsert: true });
        }
    }
})();
