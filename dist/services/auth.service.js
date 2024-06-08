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
exports.AuthService = void 0;
const authCredentials_entity_1 = require("../entities/authCredentials.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqs_service_1 = require("./sqs.service");
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const envVars_config_1 = require("../configs/envVars.config");
const emailer_service_1 = require("./emailer.service");
const sendEmailStatus_enum_1 = require("../constants/sendEmailStatus.enum");
class AuthService {
    constructor() {
        this.sqsService = new sqs_service_1.SQSService();
        this.emailerService = new emailer_service_1.EmailerService();
    }
    registerNewUser(newEmail, newUsername, newPassword, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authCredentials_entity_1.AuthCredentials.findOne({ username: newUsername });
                if (result === null) {
                    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                    const registerNewUser = new authCredentials_entity_1.AuthCredentials({
                        email: newEmail,
                        username: newUsername,
                        password: hashedPassword,
                        role: newRole,
                    });
                    const newUser = yield registerNewUser.save();
                    const userId = newUser.user_id;
                    yield authCredentials_entity_1.AuthCredentials.findOneAndUpdate({ user_id: userId }, { createdBy: userId });
                    const sendEmailStatus = sendEmailStatus_enum_1.SendEmailStatusEnum.NEW_USER_REGISTERED_SUCCESSFULLY;
                    this.emailerService.sendEmail(newEmail, newUsername, sendEmailStatus);
                    logger_config_1.default.info("New user registered");
                    return {
                        status: 201,
                        message: "New user registered",
                    };
                }
                else if (result instanceof authCredentials_entity_1.AuthCredentials) {
                    logger_config_1.default.info("username already exists");
                    return {
                        status: 400,
                        message: "username already exists",
                    };
                }
                else {
                    logger_config_1.default.info("unknown error in registerNewUser");
                    throw new Error("unknown error in registerNewUser");
                }
            }
            catch (error) {
                logger_config_1.default.error("error in registerNewUser", error);
                return {
                    status: 500,
                    message: "internal server error",
                };
            }
        });
    }
    login(loginUsername, loginPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authCredentials_entity_1.AuthCredentials.findOne({ username: loginUsername });
                if (result instanceof authCredentials_entity_1.AuthCredentials &&
                    (yield bcrypt_1.default.compare(loginPassword, result.password))) {
                    const token = jsonwebtoken_1.default.sign({
                        user_id: result.user_id,
                        username: loginUsername,
                        role: result.role,
                    }, envVars_config_1.envVars.JWTSECRET, {
                        expiresIn: "1d",
                    });
                    logger_config_1.default.info("User just logged in");
                    return {
                        status: 200,
                        message: "You are logged in",
                        token: token,
                    };
                }
                else {
                    logger_config_1.default.info("Invalid username or password");
                    return {
                        status: 401,
                        message: "Please check your username and password",
                    };
                }
            }
            catch (error) {
                logger_config_1.default.error("Error in login", error);
                throw new Error("Unknown error in login");
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map