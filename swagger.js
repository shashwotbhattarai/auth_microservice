// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require("swagger-autogen")();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");
dotenv.config();

const doc = {
  info: {
    title: "Auth Microservice",
    description: "A microservice for signup and login.",
  },
  host: `localhost:${process.env.PORT}`,
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen(outputFile, routes, doc);
