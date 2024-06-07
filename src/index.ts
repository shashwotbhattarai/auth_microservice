import authRoute from "./routes/auth.route";
import connectToDatabase from "./configs/db.config";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import logger from "./configs/logger.config";
import { envVars } from "./configs/envVars.config";
import app from "./configs/express.config";

const port = envVars.PORT;
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
console.log("lint fuck up");

connectToDatabase();
app.use("/auth", authRoute);

app.listen(port, () => {
  logger.info(`Auth Microservice Running at port ${port}`);
  logger.info(`API documentation: http://localhost:${port}/doc`);
});
