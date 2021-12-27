"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const lights_1 = __importDefault(require("./src/routes/lights"));
const app = (0, express_1.default)();
const port = 5000;
app.use(body_parser_1.default.json());
app.use(lights_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
