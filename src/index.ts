import express from "express";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route";
import connectToDatabase from "./database/db.connect";
import cors from "cors";

const app = express();
app.disable("x-powered-by");
let corsOptions = {
	origin: "http://localhost:3000/",
};
app.use(cors(corsOptions));
const port = 3000;

app.use(bodyParser.json());

connectToDatabase();
app.use("/auth", authRoute);

app.listen(port, () => {
	console.log(`Auth Microservice Running at port ${port}`);
});
