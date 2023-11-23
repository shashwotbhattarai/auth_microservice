"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const db_connect_1 = __importDefault(require("./database/db.connect"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3000;
app.use(body_parser_1.default.json());
(0, db_connect_1.default)();
app.use("/auth", auth_route_1.default);
app.listen(port, () => {
    console.log(`Auth Microservice Running at port ${port}`);
});
