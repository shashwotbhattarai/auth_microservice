"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordEmailTemplate = exports.AccountRegisteredEmailTemplate = void 0;
exports.AccountRegisteredEmailTemplate = {
    subject: "Your Account Has Been Registered",
    text: "Hi {{username}} Thank you for creating new account.",
};
exports.ForgotPasswordEmailTemplate = {
    subject: "Reset Password",
    text: "Hi {{username}} Please use the following code to reset your password: {{passwordResetCode}}",
};
//# sourceMappingURL=email.templates.js.map