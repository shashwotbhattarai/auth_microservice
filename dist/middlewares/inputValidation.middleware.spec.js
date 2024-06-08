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
const inputValidation_middleware_1 = __importDefault(require("./inputValidation.middleware"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const inputvalidationMiddleware = new inputValidation_middleware_1.default();
jest.mock("../configs/logger.config", () => ({
    error: jest.fn(),
}));
describe("validateSignup", () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post("/test", inputvalidationMiddleware.validateSignupData, (req, res) => {
        res.status(200).send("Passed validation");
    });
    it("passes validation for correct signup data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/test")
            .set("username", "testuser")
            .set("password", "Password@123")
            .send({ email: "test@example.com", role: "candidate" });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Passed validation");
    }));
    it("fails validation for incorrect signup data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/test")
            .set("username", "testuser")
            .set("password", "")
            .send({ email: "test@example", role: "recruiter" });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('{"status":"error","message":"\\"password\\" is not allowed to be empty"}');
    }));
});
describe("validateHeaderForUsername", () => {
    const validateHeaderDataMiddleware = new inputValidation_middleware_1.default();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(validateHeaderDataMiddleware.validateResetPasswordData);
    app.get("/test", (req, res) => {
        res.status(200).send({ message: "Success" });
    });
    it("should allow the request when valid password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("password", "Password@1234");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Success" });
    }));
    it("should return 400 when password is not strong", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("password", "password123");
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('{"status":"error","message":"\\"password\\" with value \\"password123\\" fails to match the required pattern: /(?=.*\\\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/"}');
    }));
});
//# sourceMappingURL=inputValidation.middleware.spec.js.map