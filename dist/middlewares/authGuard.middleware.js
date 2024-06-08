"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_config_1 = __importDefault(require("../configs/logger.config"));
const envVars_config_1 = require("../configs/envVars.config");
class AuthGuardMiddleware {
    protectRoute(allowedRoles) {
        return (req, res, next) => {
            if (!req.headers.authorization) {
                logger_config_1.default.info("Authorization header missing");
                return res
                    .status(401)
                    .json({ message: "Authorization header missing" });
            }
            const token = req.headers.authorization.slice(7);
            if (token === "") {
                logger_config_1.default.info("Access token is missing");
                return res.status(401).json({ message: "Access token is missing" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, envVars_config_1.envVars.JWTSECRET);
            const userRole = decoded.role;
            if (!allowedRoles.includes(userRole)) {
                logger_config_1.default.info("Access denied");
                return res.status(403).json({ message: "Access denied" });
            }
            logger_config_1.default.info("Access granted");
            next();
        };
    }
}
exports.default = AuthGuardMiddleware;
//# sourceMappingURL=authGuard.middleware.js.map