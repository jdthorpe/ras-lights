import express from "express";
import bodyParser from "body-parser";
import lights from "./src/routes/lights";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use("/lights", lights);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
