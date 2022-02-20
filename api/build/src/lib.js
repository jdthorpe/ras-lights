"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove_library = exports.upsert_library = exports.list_library = exports.reload_library = void 0;
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./db");
const watch_1 = require("./watch");
async function reload_library(name) {
    const results = await db_1.adminStore.findOne({ type: "LIBRARY", name }, { _id: 0 });
    if (!results) {
        throw new Error(`no such library ${name}`);
    }
    (0, watch_1.reimport)(results);
}
exports.reload_library = reload_library;
async function list_library() {
    return db_1.adminStore.find({ type: "LIBRARY" }, { _id: 0 });
}
exports.list_library = list_library;
async function upsert_library(x) {
    if (!fs_1.default.existsSync(x.path)) {
        console.log(`[LIB/POST] no such library: ${x.path}`);
        throw new Error(`no such library ${x.path}`);
    }
    console.log(`[LIB/POST] upserting ${x.name} @ ${x.path}`);
    const lib = { type: "LIBRARY", ...x };
    db_1.adminStore.update({ type: "LIBRARY", name: x.name }, lib, { upsert: true });
}
exports.upsert_library = upsert_library;
async function remove_library(name) {
    console.log(`removing library: ${name}`);
    db_1.adminStore.remove({ name }, { multi: true });
    console.log("done");
}
exports.remove_library = remove_library;
