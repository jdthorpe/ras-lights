import express from "express";
import lights from "./src/routes/lights";
import mode from "./src/routes/mode";
import lib from "./src/routes/lib";
import driver from "./src/routes/driver";
import registry from "./src/routes/registry";
import schedule from "./src/routes/schedule";
import controller from "./src/routes/control";
import settingsRoute from "./src/routes/settings";

const app = express();
const port = 5000; // this has to match the nginx config!!

app.use(express.json());
app.use("/lights", lights);
app.use("/settings", settingsRoute);
app.use("/mode", mode);
app.use("/lib", lib);
app.use("/driver", driver);
app.use("/registry", registry);
app.use("/schedule", schedule);
app.use("/ctl", controller);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
