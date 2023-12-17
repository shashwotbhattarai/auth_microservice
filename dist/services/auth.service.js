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
const authCredentials_model_1 = require("../database/models/authCredentials.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqs_service_1 = require("./sqs.service");
const create_SQSClient_service_1 = require("./create.SQSClient.service");
class AuthService {
    registerNewUser(newEmail, newUsername, newPassword, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authCredentials_model_1.AuthCredentials.findOne({ username: newUsername });
                if (result === null) {
                    const registerNewUser = new authCredentials_model_1.AuthCredentials({
                        email: newEmail,
                        username: newUsername,
                        password: newPassword,
                        role: newRole,
                    });
                    const registerNewUserResult = yield registerNewUser.save();
                    const emailPayload = {
                        to: newEmail,
                        subject: "Your Account Has Been Registered",
                        text: "HI " + newRole + " " + "Thank you for creating new account.",
                    };
                    const sqsClient = yield (0, create_SQSClient_service_1.createSQSClient)();
                    const sendMessageToQueueResult = yield new sqs_service_1.SQS_Service().sendMessageToQueue(emailPayload, sqsClient);
                    return {
                        status: 201,
                        message: "New user registered",
                    };
                }
                else if (result instanceof authCredentials_model_1.AuthCredentials) {
                    return {
                        status: 400,
                        message: "username already exists",
                    };
                }
                else {
                    return {
                        status: 500,
                        message: "internal server error",
                    };
                }
            }
            catch (error) {
                return {
                    status: 500,
                    message: error,
                };
            }
        });
    }
    login(loginUsername, loginPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authCredentials_model_1.AuthCredentials.findOne({ username: loginUsername });
                if (result instanceof authCredentials_model_1.AuthCredentials && loginPassword == result.password) {
                    const token = jsonwebtoken_1.default.sign({
                        user_id: result.user_id,
                        username: loginUsername,
                        role: result.role,
                    }, process.env.JWTSECRET, {
                        expiresIn: "1d",
                    });
                    return {
                        status: 200,
                        message: "you are loged in",
                        token: token,
                    };
                }
                else if (result instanceof authCredentials_model_1.AuthCredentials && loginPassword != result.password) {
                    return {
                        status: 401,
                        message: "please check your username and password",
                    };
                }
                else if (result === null) {
                    return {
                        status: 401,
                        message: "username not found",
                    };
                }
                else {
                    return {
                        status: 500,
                        message: "internal server error",
                    };
                }
            }
            catch (error) {
                return {
                    status: 500,
                    message: error,
                };
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map