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
exports.EmailerService = void 0;
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const sqs_service_1 = require("./sqs.service");
const sendEmailStatus_enum_1 = require("../constants/sendEmailStatus.enum");
const email_templates_1 = require("../constants/email.templates");
class EmailerService {
    constructor() {
        this.sqsService = new sqs_service_1.SQSService();
    }
    constructEmailPayload(email, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailPayload = {
                to: email,
                subject: subject,
                text: text,
            };
            logger_config_1.default.info("Email payload created successfully");
            return emailPayload;
        });
    }
    sendEmail(email, username, status, securityCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let subject = "";
            let text = "";
            switch (status) {
                case sendEmailStatus_enum_1.SendEmailStatusEnum.NEW_USER_REGISTERED_SUCCESSFULLY:
                    subject = email_templates_1.AccountRegisteredEmailTemplate.subject;
                    text = email_templates_1.AccountRegisteredEmailTemplate.text.replace("{{username}}", username);
                    break;
                case sendEmailStatus_enum_1.SendEmailStatusEnum.FORGOT_PASSWORD:
                    subject = email_templates_1.ForgotPasswordEmailTemplate.subject;
                    text = email_templates_1.ForgotPasswordEmailTemplate.text.replace("{{username}}", username);
                    text = text.replace("{{passwordResetCode}}", securityCode);
            }
            try {
                const emailPayload = yield this.constructEmailPayload(email, subject, text);
                const response = yield this.sqsService.sendMessageToQueue(emailPayload);
                logger_config_1.default.info("message sent to queue", response);
                return {
                    status: 200,
                    message: "message sent to queue",
                };
            }
            catch (error) {
                throw new Error("Error in sendEmail");
            }
        });
    }
}
exports.EmailerService = EmailerService;
//# sourceMappingURL=emailer.service.js.map