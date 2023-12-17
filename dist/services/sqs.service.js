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
exports.SQS_Service = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const generate_unique_id_1 = __importDefault(require("generate-unique-id"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SQS_Service {
    sendMessageToQueue(emailPayload, client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sqsQueueUrl = process.env.SQS_QUEUE_URL;
                const response = yield client.send(new client_sqs_1.SendMessageCommand({
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
                return { status: 200, message: "message sent to queue" };
            }
            catch (error) {
                return { status: 500, message: error };
            }
        });
    }
}
exports.SQS_Service = SQS_Service;
//# sourceMappingURL=sqs.service.js.map