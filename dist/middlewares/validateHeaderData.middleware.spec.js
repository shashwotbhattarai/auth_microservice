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
const body_parser_1 = __importDefault(require("body-parser"));
const validateHeaderData_middleware_1 = __importDefault(require("./validateHeaderData.middleware"));
describe("validateHeaderForUsernameAndPassword", () => {
    const validateHeaderDataMiddleware = new validateHeaderData_middleware_1.default();
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(validateHeaderDataMiddleware.validateHeaderForUsernameAndPassword);
    app.get("/test", (req, res) => {
        res.status(200).send({ message: "Success" });
    });
    it("should allow the request to proceed when username and password are valid strings", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("username", "testuser")
            .set("password", "testpass");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Success" });
    }));
    it("should return 401 when username is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("password", "testpass");
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
    it("should return 401 when password is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("username", "testuser");
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
});
describe("validateHeaderForUsername", () => {
    const validateHeaderDataMiddleware = new validateHeaderData_middleware_1.default();
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(validateHeaderDataMiddleware.validateHeaderForUsername);
    app.get("/test", (req, res) => {
        res.status(200).send({ message: "Success" });
    });
    it("should allow the request to proceed when username is valid string", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("username", "testuser");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Success" });
    }));
    it("should return 401 when username is not passed/undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/test");
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
});
describe("validateHeaderForUsernameAndSecurityCode", () => {
    const validateHeaderDataMiddleware = new validateHeaderData_middleware_1.default();
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use(validateHeaderDataMiddleware.validateHeaderForUsernameAndSecurityCode);
    app.get("/test", (req, res) => {
        res.status(200).send({ message: "Success" });
    });
    it("should allow the request to proceed when username and securitycode are valid strings", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("username", "testuser")
            .set("securitycode", "12345");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Success" });
    }));
    it("should return 401 when username is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("securitycode", "12345");
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
    it("should return 401 when securitycode is not passed", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("username", "testuser");
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: "Invalid credentials",
        });
    }));
});
//# sourceMappingURL=validateHeaderData.middleware.spec.js.map