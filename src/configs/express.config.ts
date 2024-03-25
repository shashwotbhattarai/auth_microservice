import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { envVars } from "./envVars.config";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
  origin: [envVars.Access_Control_Allow_Origin_URL as string],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

export default app;
