"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from "body-parser";
const lights_1 = __importDefault(require("./src/routes/lights"));
const mode_1 = __importDefault(require("./src/routes/mode"));
const registry_1 = __importDefault(require("./src/routes/registry"));
const schedule_1 = __importDefault(require("./src/routes/schedule"));
const control_1 = __importDefault(require("./src/routes/control"));
const settings_1 = __importDefault(require("./src/settings"));
const app = (0, express_1.default)();
const port = (settings_1.default.api && settings_1.default.api.port) || 5000;
app.use(express_1.default.json());
app.use("/lights", lights_1.default);
app.use("/mode", mode_1.default);
app.use("/registry", registry_1.default);
app.use("/schedule", schedule_1.default);
app.use("/ctl", control_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
