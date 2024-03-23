// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require("swagger-autogen")();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const envVars = "../config/envVars";

const doc = {
  info: {
    title: "Auth Microservice",
    description: "A microservice for signup and login.",
  },
  host: `localhost:${envVars.PORT}`,
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);
