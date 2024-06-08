"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const envVars_config_1 = require("./envVars.config");
const app = (0, express_1.default)();
app.disable("x-powered-by");
const corsOptions = {
    origin: [envVars_config_1.envVars.Access_Control_Allow_Origin_URL],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
exports.default = app;
//# sourceMappingURL=express.config.js.map