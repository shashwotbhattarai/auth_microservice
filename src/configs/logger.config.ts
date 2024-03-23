import { createLogger, format, transports } from "winston";
import * as dotenv from "dotenv";
import { envVars } from "./envVars.config";
dotenv.config();

const env = envVars.ENV;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatParams = (info: any) => {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}:${message} ${Object.keys(args).length ? JSON.stringify(args) : ""}`;
};

const Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
);

const transportArray =
  env === "production"
    ? [
        new transports.File({
          filename: "authMicroserviceLogs.log",
          level: "info",
        }),
      ]
    : [new transports.Console()];

const logger = createLogger({
  level: "info",
  format: Format,
  transports: transportArray,
});

export default logger;
