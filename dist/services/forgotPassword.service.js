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
const envVars_config_1 = require("../configs/envVars.config");
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const sendEmailStatus_enum_1 = require("../constants/sendEmailStatus.enum");
const authCredentials_entity_1 = require("../entities/authCredentials.entity");
const emailer_service_1 = require("./emailer.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rn = require("random-number");
class ForgotPasswordService {
    constructor() {
        this.emailService = new emailer_service_1.EmailerService();
    }
    emailSecurityCode(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authCredentials_entity_1.AuthCredentials.findOne({ username: username });
                if (!user) {
                    return {
                        status: 404,
                        message: "User not found",
                    };
                }
                const options = {
                    min: 0,
                    max: 99999,
                    integer: true,
                };
                const randomNumber = rn(options);
                const randomNumberString = randomNumber.toString();
                yield authCredentials_entity_1.AuthCredentials.findOneAndUpdate({ username: username }, { securityCode: randomNumberString }, { updatedBy: user.user_id });
                this.emailService.sendEmail(user.email, username, sendEmailStatus_enum_1.SendEmailStatusEnum.FORGOT_PASSWORD, randomNumberString);
                logger_config_1.default.info("Password Reset Code sent in Email");
                return {
                    status: 200,
                    message: "Password Reset Code sent in Email",
                };
            }
            catch (error) {
                logger_config_1.default.error("Unknown Error in emailSecurityCode", error);
                return {
                    status: 500,
                    message: "Internal Server Error",
                };
            }
        });
    }
    verifySecurityCode(username, securityCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authCredentials_entity_1.AuthCredentials.findOne({
                    username: username,
                    securityCode: securityCode,
                });
                if (!user) {
                    return {
                        status: 400,
                        message: "Bad Request",
                    };
                }
                const token = jsonwebtoken_1.default.sign({
                    user_id: user.user_id,
                    username: user.username,
                    role: user.role,
                }, envVars_config_1.envVars.JWTSECRET, {
                    expiresIn: "1d",
                });
                return {
                    status: 200,
                    message: "Security code verified, Please Enter New Password",
                    token: token,
                };
            }
            catch (error) {
                logger_config_1.default.error("Unknown Error in emailSecurityCode", error);
                return {
                    status: 500,
                    message: "Internal Server Error",
                };
            }
        });
    }
    resetPassword(username, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authCredentials_entity_1.AuthCredentials.findOne({ username: username });
                if (!user) {
                    return {
                        status: 404,
                        message: "User not found",
                    };
                }
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                yield authCredentials_entity_1.AuthCredentials.findOneAndUpdate({ username: username }, { username: username, password: hashedPassword }, { updatedBy: user.user_id });
                logger_config_1.default.info("Password Reset Successfully");
                return {
                    status: 200,
                    message: "Password Reset Successfully",
                };
            }
            catch (error) {
                logger_config_1.default.error("Unknown Error in resetPassword", error);
                return {
                    status: 500,
                    message: "Internal Server Error",
                };
            }
        });
    }
}
exports.default = ForgotPasswordService;
//# sourceMappingURL=forgotPassword.service.js.map