import mongoose from "mongoose";
import { envVars } from "./envVars.config";
import logger from "./logger.config";

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(envVars.DATABASEURI as string);
    logger.info("Connected to the database");
  } catch (error) {
    logger.error(`Error connecting to the database.`, error);
  }
}

export default connectToDatabase;
