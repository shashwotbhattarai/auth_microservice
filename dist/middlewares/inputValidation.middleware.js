"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateSignUpInput_schema_1 = require("../constants/validateSignUpInput.schema");
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const validateResetPasswordInput_schema_1 = require("../constants/validateResetPasswordInput.schema");
class InputValidationMiddleware {
    constructor() {
        this.validateSignupData = (req, res, next) => {
            const headerData = req.headers;
            const signupDataPayload = {
                username: headerData.username,
                password: headerData.password,
                email: req.body.email,
                role: req.body.role,
            };
            const { error } = validateSignUpInput_schema_1.validateSignupInput.validate(signupDataPayload);
            if (error) {
                logger_config_1.default.error("Input validation error in InputValidationMiddleware.validateSignupData", error);
                res.status(400).json({
                    status: "error",
                    message: error.details[0].message,
                });
            }
            else {
                next();
            }
        };
        this.validateResetPasswordData = (req, res, next) => {
            const headerData = req.headers;
            const resetPasswordDataPayload = {
                password: headerData.password,
            };
            const { error } = validateResetPasswordInput_schema_1.validateResetPasswordInput.validate(resetPasswordDataPayload);
            if (error) {
                logger_config_1.default.error("Input validation error in InputValidationMiddleware.validateResetPasswordData", error);
                res.status(400).json({
                    status: "error",
                    message: error.details[0].message,
                });
            }
            else {
                next();
            }
        };
    }
}
exports.default = InputValidationMiddleware;
//# sourceMappingURL=inputValidation.middleware.js.map