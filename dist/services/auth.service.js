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
class AuthService {
    registerNewUser(newEmail, newUsername, newPassword, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authCredentials_model_1.AuthCredentials.findOne({ username: newUsername });
                if (result == null) {
                    const registerNewUser = new authCredentials_model_1.AuthCredentials({
                        email: newEmail,
                        username: newUsername,
                        password: newPassword,
                        role: newRole,
                    });
                    yield registerNewUser.save();
                    return {
                        status: 201,
                        message: "New user registered",
                    };
                }
                else {
                    return {
                        status: 400,
                        message: "username already exists",
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
                if (result !== null && loginPassword == result.password) {
                    const token = jsonwebtoken_1.default.sign({
                        user_id: result.user_id,
                        username: loginUsername,
                        role: result.role,
                    }, process.env.JWTSECRET, {
                        expiresIn: "1d",
                    });
                    return {
                        status: 200,
                        message: { token: token },
                    };
                }
                else {
                    return {
                        status: 401,
                        message: "please check your username and password",
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
