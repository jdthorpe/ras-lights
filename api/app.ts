import express from "express";
// import bodyParser from "body-parser";
import lights from "./src/routes/lights";
import mode from "./src/routes/mode";
import registry from "./src/routes/registry";
import schedule from "./src/routes/schedule";
import controller from "./src/routes/control";
import settings from "./src/settings";

const app = express();
const port = (settings.api && settings.api.port) || 5000;

app.use(express.json());
app.use("/lights", lights);
app.use("/mode", mode);
app.use("/registry", registry);
app.use("/schedule", schedule);
app.use("/ctl", controller);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
