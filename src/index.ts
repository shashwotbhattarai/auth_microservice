import express from "express";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route";
import connectToDatabase from "./database/db.connect";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json());

connectToDatabase();
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Auth Microservice Running at port ${port}`);
});
