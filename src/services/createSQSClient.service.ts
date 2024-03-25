import { SQSClient } from "@aws-sdk/client-sqs";
import logger from "../configs/logger.config";
import { envVars } from "../configs/envVars.config";
import { ServiceResponse } from "../models/serviceResponse.type";

export default class CreateSQSClientService {
  public async createSQSClient(): Promise<ServiceResponse> {
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
        client: client,
      };
    } else {
      logger.error("Unknown error in creating SQS client");
      throw new Error("error in createSQSClient");
    }
  }
}
