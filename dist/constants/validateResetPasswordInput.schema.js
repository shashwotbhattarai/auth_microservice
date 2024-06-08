"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPasswordInput = void 0;
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("./regex");
exports.validateResetPasswordInput = joi_1.default.object({
    password: joi_1.default.string().min(8).pattern(new RegExp(regex_1.pwRegex)).required(),
});
//# sourceMappingURL=validateResetPasswordInput.schema.js.map