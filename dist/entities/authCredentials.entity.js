"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentials = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const authCredentialsSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
        default: uuid_1.v4,
        unique: true,
    },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
    securityCode: { type: String },
}, { timestamps: true });
exports.AuthCredentials = (0, mongoose_1.model)("AuthCredentials", authCredentialsSchema);
//# sourceMappingURL=authCredentials.entity.js.map