import { SendMessageCommand } from "@aws-sdk/client-sqs";
import generateUniqueId from "generate-unique-id";
import CreateSQSClientService from "./createSQSClient.service";
import { EmailPayload } from "../models/emailPayload.interface";
import logger from "../configs/logger.config";
import { envVars } from "../configs/envVars.config";

export class SQSService {
  async sendMessageToQueue(emailPayload: EmailPayload) {
    try {
      const createSQSClientResponse =
        await new CreateSQSClientService().createSQSClient();
      const client = createSQSClientResponse.data;
      const sqsQueueUrl = envVars.SQS_QUEUE_URL;

      await client.send(
        new SendMessageCommand({
          QueueUrl: sqsQueueUrl,
          MessageAttributes: {
            To: {
              DataType: "String",
              StringValue: emailPayload.to,
            },
            Subject: {
              DataType: "String",
              StringValue: emailPayload.subject,
            },
          },
          MessageBody: emailPayload.text,
          MessageGroupId: "sendEmailResumeTracker",
          MessageDeduplicationId: generateUniqueId(),
        }),
      );
      logger.info("Message sent to Emailer SQS Queue");
      return { status: 200, message: "message sent to queue" };
    } catch (error) {
      logger.error("Unknown Error in sendMessageToQueue", error);
      return { status: 500, message: error };
    }
  }
}
