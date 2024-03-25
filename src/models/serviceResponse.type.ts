import { SQSClient } from "@aws-sdk/client-sqs";
export type ServiceResponse = {
  status: number;
  message: string;
  token?: string;
  client?: SQSClient | undefined;
};
