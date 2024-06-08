"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidateHeaderDataMiddleware {
    constructor() {
        this.validateHeaderForUsernameAndPassword = (req, res, next) => {
            const username = req.headers.username;
            const password = req.headers.password;
            if (typeof username !== "string" || typeof password !== "string") {
                res.status(401).send({
                    message: "Invalid credentials",
                });
            }
            else {
                next();
            }
        };
        this.validateHeaderForUsername = (req, res, next) => {
            const username = req.headers.username;
            if (typeof username !== "string" || username === undefined) {
                res.status(401).send({
                    message: "Invalid credentials",
                });
            }
            else {
                next();
            }
        };
        this.validateHeaderForUsernameAndSecurityCode = (req, res, next) => {
            const securityCode = req.headers.securitycode;
            const username = req.headers.username;
            if (typeof securityCode !== "string" || typeof username !== "string") {
                res.status(401).send({
                    message: "Invalid credentials",
                });
            }
            else {
                next();
            }
        };
    }
}
exports.default = ValidateHeaderDataMiddleware;
//# sourceMappingURL=validateHeaderData.middleware.js.map