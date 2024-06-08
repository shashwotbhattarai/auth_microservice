"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignupInput = void 0;
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../constants/regex");
exports.validateSignupInput = joi_1.default.object({
    username: joi_1.default.string().pattern(new RegExp(regex_1.usernameRegex)).required(),
    password: joi_1.default.string().min(8).pattern(new RegExp(regex_1.pwRegex)).required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().min(9).max(9),
});
//# sourceMappingURL=validateSignUpInput.schema.js.map