import express from "express";
import bodyParser from "body-parser";
import lights from "./src/routes/lights";
import mode from "./src/routes/mode";
import registry from "./src/routes/registry";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use("/lights", lights);
app.use("/mode", mode);
app.use("/registry", registry);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
