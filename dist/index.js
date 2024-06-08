"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const db_config_1 = __importDefault(require("./configs/db.config"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("../swagger-output.json"));
const logger_config_1 = __importDefault(require("./configs/logger.config"));
const envVars_config_1 = require("./configs/envVars.config");
const express_config_1 = __importDefault(require("./configs/express.config"));
const port = envVars_config_1.envVars.PORT;
express_config_1.default.use("/doc", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
(0, db_config_1.default)();
express_config_1.default.use("/auth", auth_route_1.default);
express_config_1.default.listen(port, () => {
    logger_config_1.default.info(`Auth Microservice Running at port ${port}`);
    logger_config_1.default.info(`API documentation: http://localhost:${port}/doc`);
});
//# sourceMappingURL=index.js.map