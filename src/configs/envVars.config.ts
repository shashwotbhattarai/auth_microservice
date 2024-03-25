import * as dotenv from "dotenv";
dotenv.config();

export const envVars = {
  DATABASEURI: process.env.DATABASEURI,
  JWTSECRET: process.env.JWTSECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,
  PATH: process.env.PATH,
  Access_Control_Allow_Origin: process.env.Access_Control_Allow_Origin,
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  Access_Control_Allow_Origin_URL: process.env.Access_Control_Allow_Origin_URL,
};
