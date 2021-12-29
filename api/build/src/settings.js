"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ini_1 = __importDefault(require("ini"));
const settings = ini_1.default.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "..", "..", "..", "config.ini"), "utf-8"));
exports.default = settings;
