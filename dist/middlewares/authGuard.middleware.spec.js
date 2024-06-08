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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authGuard_middleware_1 = __importDefault(require("./authGuard.middleware"));
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));
describe("AuthGuardMiddleware", () => {
    let app;
    let authGuardMiddleware;
    beforeAll(() => {
        app = (0, express_1.default)();
        authGuardMiddleware = new authGuard_middleware_1.default();
        jest.mock("../configs/logger.config", () => ({
            error: jest.fn(),
        }));
        app.get("/protected-route", authGuardMiddleware.protectRoute(["admin"]), (req, res) => {
            res.status(200).json({ message: "Access granted to protected route" });
        });
    });
    it("should respond with 401 if authorization header is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/protected-route");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Authorization header missing");
    }));
    it("should respond with 401 if access token is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/protected-route")
            .set("Authorization", "Bearer ");
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Access token is missing");
    }));
    it("should respond with 403 if user role is not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValueOnce({ role: "user" });
        const token = "mockedToken";
        const response = yield (0, supertest_1.default)(app)
            .get("/protected-route")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Access denied");
    }));
    it("should allow access if user role is allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValueOnce({ role: "admin" });
        const token = "mockedToken";
        const response = yield (0, supertest_1.default)(app)
            .get("/protected-route")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Access granted to protected route");
    }));
});
//# sourceMappingURL=authGuard.middleware.spec.js.map