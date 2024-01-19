import express from "express";
import bodyParser from "body-parser";
import authRoute from "./routes/auth.route";
import connectToDatabase from "./database/db.connect";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";

const app = express();
app.disable("x-powered-by");
const corsOptions = {
	origin: "http://localhost:3000/",
};
app.use(cors(corsOptions));
const port = 3000;

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectToDatabase();
app.use("/auth", authRoute);

app.listen(port, () => {
	console.log(`Auth Microservice Running at port ${port}\nAPI documentation: http://localhost:3000/doc`);
});
