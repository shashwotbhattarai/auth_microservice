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
Object.defineProperty(exports, "__esModule", { value: true });
const emailer_service_1 = require("./emailer.service");
const sqs_service_1 = require("./sqs.service");
const sendEmailStatus_enum_1 = require("../constants/sendEmailStatus.enum");
jest.mock("../configs/logger.config");
jest.mock("./sqs.service");
describe("EmailerService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("constructEmailPayload", () => {
        it("should construct email payload according to the params passsed", () => __awaiter(void 0, void 0, void 0, function* () {
            const subject = "Test Subject";
            const text = "Test Body";
            const email = "test@example.com";
            const emailerService = new emailer_service_1.EmailerService();
            const result = yield emailerService.constructEmailPayload(email, subject, text);
            expect(result.to).toBe(email);
            expect(result.subject).toBe(subject);
            expect(result.text).toBe(text);
        }));
    });
    describe("sendEmail", () => {
        it("should responde with status:200 when status is NEW_USER_REGISTERED_SUCCESSFULLY and  message is sent to queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = sendEmailStatus_enum_1.SendEmailStatusEnum.NEW_USER_REGISTERED_SUCCESSFULLY;
            const subject = "Test Subject";
            const text = "Test Body";
            const email = "test@example.com";
            const username = "tesUSername";
            const emailPayload = {
                to: email,
                subject: subject,
                text: text,
            };
            const constructEmailPayloadSpy = jest.spyOn(emailer_service_1.EmailerService.prototype, "constructEmailPayload");
            constructEmailPayloadSpy.mockResolvedValue(emailPayload);
            const sendMessageToQueueSpy = jest.spyOn(sqs_service_1.SQSService.prototype, "sendMessageToQueue");
            sendMessageToQueueSpy.mockResolvedValue({
                status: 200,
                message: "message sent to sqs queue",
            });
            const emailerService = new emailer_service_1.EmailerService();
            const response = yield emailerService.sendEmail(email, username, status);
            expect(response.status).toBe(200);
        }));
        it("should responde with status:200 when status is FORGOT_PASSWORD and  message is sent to queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = sendEmailStatus_enum_1.SendEmailStatusEnum.NEW_USER_REGISTERED_SUCCESSFULLY;
            const subject = "Test Subject";
            const text = "Test Body";
            const email = "test@example.com";
            const username = "tesUSername";
            const emailPayload = {
                to: email,
                subject: subject,
                text: text,
            };
            const constructEmailPayloadSpy = jest.spyOn(emailer_service_1.EmailerService.prototype, "constructEmailPayload");
            constructEmailPayloadSpy.mockResolvedValue(emailPayload);
            const sendMessageToQueueSpy = jest.spyOn(sqs_service_1.SQSService.prototype, "sendMessageToQueue");
            sendMessageToQueueSpy.mockResolvedValue({
                status: 200,
                message: "message sent to sqs queue",
            });
            const emailerService = new emailer_service_1.EmailerService();
            const response = yield emailerService.sendEmail(email, username, status);
            expect(response.status).toBe(200);
        }));
        it("should throw an error:Error in sendEmail, when any error occures", () => __awaiter(void 0, void 0, void 0, function* () {
            const status = sendEmailStatus_enum_1.SendEmailStatusEnum.FORGOT_PASSWORD;
            const subject = "Test Subject";
            const text = "Test Body";
            const email = "test@example.com";
            const username = "tesUSername";
            const securityCode = "65566";
            const emailPayload = {
                to: email,
                subject: subject,
                text: text,
            };
            const constructEmailPayloadSpy = jest.spyOn(emailer_service_1.EmailerService.prototype, "constructEmailPayload");
            constructEmailPayloadSpy.mockResolvedValue(emailPayload);
            const sendMessageToQueueSpy = jest.spyOn(sqs_service_1.SQSService.prototype, "sendMessageToQueue");
            sendMessageToQueueSpy.mockRejectedValue(new Error("sendMessageToQueue test"));
            const emailerService = new emailer_service_1.EmailerService();
            try {
                yield emailerService.sendEmail(email, username, status, securityCode);
            }
            catch (error) {
                expect(error).toEqual(new Error("Error in sendEmail"));
            }
        }));
    });
});
//# sourceMappingURL=emailer.service.spec.js.map