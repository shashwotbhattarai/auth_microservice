import { SQSClient } from "@aws-sdk/client-sqs";
import logger from "../configs/logger.config";
import { envVars } from "../configs/envVars.config";

export default class CreateSQSClientService {
  async createSQSClient() {
    if (
      envVars.AWS_ACCESS_KEY_ID &&
      envVars.AWS_SECRET_ACCESS_KEY &&
      envVars.AWS_REGION
    ) {
      const client = new SQSClient({
        credentials: {
          accessKeyId: envVars.AWS_ACCESS_KEY_ID,
          secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        },
        region: envVars.AWS_REGION,
      });
      logger.info("SQS Client created");
      return {
        status: 200,
        message: "SQSClient created",
        data: client,
      };
    } else {
      logger.error("Unknown error in creating SQS client");
      throw new Error("error in createSQSClient");
    }
  }
}
