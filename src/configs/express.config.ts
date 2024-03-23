import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

export default app;
