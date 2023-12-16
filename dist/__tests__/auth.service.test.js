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
const auth_service_1 = require("../services/auth.service");
const authCredentials_model_1 = require("../database/models/authCredentials.model");
const sqs_service_1 = require("../services/sqs.service");
const mockingoose = require("mockingoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("AuthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("registerNewUser", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("if database call gets results in an error", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(new Error("Database error"), "findOne");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.registerNewUser("test@example.com", "testUser", "password123", "user");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(500);
            // expect(finalResult?.message?.message).toMatch(/Database error/);
        }));
        test("if username doesnt exists in database, new user is created and annd email is sent", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(null, "findOne");
            jest.mock("../services/sqs.service", () => {
                return {
                    SQS_Service: jest.fn().mockImplementation(() => ({
                        sendMessageToQueue: jest.fn(),
                    })),
                };
            });
            const sendMessageToQueueMock = jest
                .spyOn(sqs_service_1.SQS_Service.prototype, "sendMessageToQueue")
                .mockResolvedValue({ status: 200, message: "message sent" });
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.registerNewUser("test@example.com", "testUser", "password123", "user");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(201);
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.message).toBe("New user registered");
        }));
        test("if username  exists in database, respond with 400 error", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn({ id: 1 }, "findOne");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.registerNewUser("test@example.com", "testUser", "password123", "user");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(400);
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.message).toBe("username already exists");
        }));
        test("if unexpected error oocurs", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(undefined, "findOne");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.registerNewUser("test@example.com", "testUser", "password123", "user");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(500);
        }));
    });
    describe("login", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("if database call gets results in an error", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(new Error("Database error"), "findOne");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.login("ram", "password");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(500);
            // expect(finalResult?.message?.message).toMatch(/Database error/);
        }));
        test("login in when valid username and password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn({ username: "ram", password: "password" }, "findOne");
            const signSpy = jest.spyOn(jsonwebtoken_1.default, "sign");
            signSpy.mockImplementation(() => "mocked-token");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.login("ram", "password");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(200);
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.token).toBe("mocked-token");
        }));
        test("error when valid password is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn({ username: "ram", password: "password" }, "findOne");
            const signSpy = jest.spyOn(jsonwebtoken_1.default, "sign");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.login("ram", "password1");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(401);
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.message).toBe("please check your username and password");
        }));
        test("error when valid username is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(null, "findOne");
            const signSpy = jest.spyOn(jsonwebtoken_1.default, "sign");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.login("ram", "password");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(401);
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.message).toBe("username not found");
        }));
        test("if database call gets results in an error", () => __awaiter(void 0, void 0, void 0, function* () {
            //mock all dependencies
            mockingoose(authCredentials_model_1.AuthCredentials).toReturn(undefined, "findOne");
            const authService = new auth_service_1.AuthService();
            const finalResult = yield authService.login("ram", "password");
            expect(finalResult === null || finalResult === void 0 ? void 0 : finalResult.status).toBe(500);
        }));
    });
});
//# sourceMappingURL=auth.service.test.js.map