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
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../services/auth.service");
const signup_validate_1 = require("../validators/signup.validate");
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = signup_validate_1.validateSignupInput.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const authService = new auth_service_1.AuthService();
    const authServiceResponse = yield authService.registerNewUser(req.body.email, req.body.username, req.body.password, req.body.role);
    res.status(authServiceResponse.status).send(authServiceResponse.message);
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authService = new auth_service_1.AuthService();
    const authServiceResponse = yield authService.login(req.body.username, req.body.password);
    res.status(authServiceResponse.status).json({ message: authServiceResponse.message });
}));
exports.default = router;
