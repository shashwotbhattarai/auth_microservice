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
const forgotPassword_service_1 = __importDefault(require("./forgotPassword.service"));
const authCredentials_entity_1 = require("../entities/authCredentials.entity");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");
jest.mock("./sqs.service", () => {
    return {
        SQSService: jest.fn().mockImplementation(() => {
            return { sendMessageToQueue: jest.fn() };
        }),
    };
});
jest.mock("../configs/logger.config", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));
describe("ForgotPasswordService", () => {
    let forgotPasswordService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockUser;
    beforeEach(() => {
        forgotPasswordService = new forgotPassword_service_1.default();
        mockUser = {
            user_id: "123",
            username: "john.doe",
            email: "john.doe@example.com",
            role: "user",
        };
        jest.clearAllMocks();
    });
    describe("emailSecurityCode", () => {
        it("should send a security code email if user exists", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn({ id: 1 }, "findOne");
            const response = yield forgotPasswordService.emailSecurityCode("john.doe");
            expect(response).toEqual({
                status: 200,
                message: "Password Reset Code sent in Email",
            });
        }));
        it("should return a 404 error if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(null, "findOne");
            const response = yield forgotPasswordService.emailSecurityCode("john.doe");
            expect(response).toEqual({
                status: 404,
                message: "User not found",
            });
        }));
        it("should return a 500 error if there is an unexpected error", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(new Error("Unexpected error"), "findOne");
            const response = yield forgotPasswordService.emailSecurityCode("john.doe");
            expect(response).toEqual({
                status: 500,
                message: "Internal Server Error",
            });
        }));
    });
    describe("verifySecurityCode", () => {
        it("should verify the security code and return a token on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserWithSecurityCode = Object.assign(Object.assign({}, mockUser), { securityCode: "12345" });
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(mockUserWithSecurityCode, "findOne");
            const response = yield forgotPasswordService.verifySecurityCode("john.doe", "12345");
            expect(response.status).toBe(200);
            expect(response.message).toContain("Please Enter New Password");
            expect(response.token).toBeDefined();
        }));
        it("should return a 400 error if the security code is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(null, "findOne");
            const response = yield forgotPasswordService.verifySecurityCode("john.doe", "wrong-code");
            expect(response).toEqual({
                status: 400,
                message: "Bad Request",
            });
        }));
        it("should handle errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(new Error("Test error"), "findOne");
            const response = yield forgotPasswordService.verifySecurityCode("john.doe", "12345");
            expect(response).toEqual({
                status: 500,
                message: "Internal Server Error",
            });
        }));
    });
    describe("resetPassword", () => {
        it("should successfully reset the user's password", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(mockUser, "findOne");
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(mockUser, "findOneAndUpdate");
            const response = yield forgotPasswordService.resetPassword("john.doe", "newPassword123");
            expect(response).toEqual({
                status: 200,
                message: "Password Reset Successfully",
            });
        }));
        it("should return a 404 error if the user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(null, "findOne");
            const response = yield forgotPasswordService.resetPassword("nonexistent.user", "newPassword123");
            expect(response).toEqual({
                status: 404,
                message: "User not found",
            });
        }));
        it("should handle errors gracefully during the reset process", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_entity_1.AuthCredentials).toReturn(new Error("Test error"), "findOne");
            const response = yield forgotPasswordService.resetPassword("john.doe", "newPassword123");
            expect(response).toEqual({
                status: 500,
                message: "Internal Server Error",
            });
        }));
    });
});
//# sourceMappingURL=forgotPassword.service.spec.js.map