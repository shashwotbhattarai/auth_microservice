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
const auth_service_1 = require("../services/auth.service");
class LoginController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
        this.login = (req, res) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                const userdata = req.headers;
                try {
                    const authServiceResponse = yield this.authService.login(userdata.username, userdata.password);
                    res.status(authServiceResponse.status).json({
                        message: authServiceResponse.message,
                        token: authServiceResponse.token,
                    });
                }
                catch (_a) {
                    res.status(500).json({
                        error: "internal server error",
                    });
                }
            }))();
        };
    }
}
exports.default = LoginController;
//# sourceMappingURL=login.controller.js.map