import { EmailPayload } from "../models/emailPayload.type";
import logger from "../configs/logger.config";
import { SQSService } from "./sqs.service";
import { SendEmailStatusEnum } from "../constants/sendEmailStatus.enum";
import { ServiceResponse } from "../models/serviceResponse.type";
import {
  AccountRegisteredEmailTemplate,
  ForgotPasswordEmailTemplate,
} from "../constants/email.templates";

export class EmailerService {
  private sqsService = new SQSService();

  public async constructEmailPayload(
    email: string,
    subject: string,
    text: string,
  ): Promise<EmailPayload> {
    const emailPayload: EmailPayload = {
      to: email,
      subject: subject,
      text: text,
    };
    logger.info("Email payload created successfully");
    return emailPayload;
  }

  public async sendEmail(
    email: string,
    username: string,
    status: string,
    securityCode?: string,
  ): Promise<ServiceResponse> {
    let subject: string = "";
    let text: string = "";

    switch (status) {
      case SendEmailStatusEnum.NEW_USER_REGISTERED_SUCCESSFULLY:
        subject = AccountRegisteredEmailTemplate.subject;
        text = AccountRegisteredEmailTemplate.text.replace(
          "{{username}}",
          username,
        );
        break;

      case SendEmailStatusEnum.FORGOT_PASSWORD:
        subject = ForgotPasswordEmailTemplate.subject;
        text = ForgotPasswordEmailTemplate.text.replace(
          "{{username}}",
          username,
        );
        text = text.replace("{{passwordResetCode}}", securityCode as string);
    }
    try {
      const emailPayload = await this.constructEmailPayload(
        email,
        subject,
        text,
      );
      const response = await this.sqsService.sendMessageToQueue(emailPayload);
      logger.info("message sent to queue", response);
      return {
        status: 200,
        message: "message sent to queue",
      };
    } catch (error) {
      throw new Error("Error in sendEmail");
    }
  }
}
