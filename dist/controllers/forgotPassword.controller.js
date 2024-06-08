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
const forgotPassword_service_1 = __importDefault(require("../services/forgotPassword.service"));
class ForgotPasswordController {
    constructor() {
        this.forgetPasswordService = new forgotPassword_service_1.default();
    }
    getSecurityCode(req, res) {
        (() => __awaiter(this, void 0, void 0, function* () {
            const userdata = req.headers;
            const response = yield this.forgetPasswordService.emailSecurityCode(userdata.username);
            res.status(response.status).send(response.message);
        }))();
    }
    verifySecurityCode(req, res) {
        (() => __awaiter(this, void 0, void 0, function* () {
            const userdata = req.headers;
            const response = yield this.forgetPasswordService.verifySecurityCode(userdata.username, userdata.securitycode);
            res
                .status(response.status)
                .send({ message: response.message, token: response.token });
        }))();
    }
    resetPassword(req, res) {
        (() => __awaiter(this, void 0, void 0, function* () {
            const userdata = req.headers;
            const response = yield this.forgetPasswordService.resetPassword(userdata.username, userdata.password);
            res.status(response.status).send(response.message);
        }))();
    }
}
exports.default = ForgotPasswordController;
//# sourceMappingURL=forgotPassword.controller.js.map