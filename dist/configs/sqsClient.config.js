"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const envVars_config_1 = require("../configs/envVars.config");
const sqsClient = new client_sqs_1.SQSClient({
    credentials: {
        accessKeyId: envVars_config_1.envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars_config_1.envVars.AWS_SECRET_ACCESS_KEY,
    },
    region: envVars_config_1.envVars.AWS_REGION,
});
exports.default = sqsClient;
//# sourceMappingURL=sqsClient.config.js.map