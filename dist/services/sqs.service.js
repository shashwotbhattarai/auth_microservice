"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSService = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const generate_unique_id_1 = __importDefault(require("generate-unique-id"));
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const envVars_config_1 = require("../configs/envVars.config");
const sqsClient_config_1 = __importDefault(require("../configs/sqsClient.config"));
class SQSService {
    sendMessageToQueue(emailPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sqsQueueUrl = envVars_config_1.envVars.SQS_QUEUE_URL;
                yield sqsClient_config_1.default.send(new client_sqs_1.SendMessageCommand({
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
                    MessageDeduplicationId: (0, generate_unique_id_1.default)(),
                }));
                logger_config_1.default.info("Message sent to Emailer SQS Queue");
                return { status: 200, message: "message sent to queue" };
            }
            catch (error) {
                logger_config_1.default.error("Unknown Error in sendMessageToQueue", error);
                return {
                    status: 500,
                    message: "Some unknown error in sendMessageToQueue",
                };
            }
        });
    }
}
exports.SQSService = SQSService;
//# sourceMappingURL=sqs.service.js.map