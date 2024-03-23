// Import the function to test
import { createSQSClient } from "../services/createSQSClient.service";

// Mocking the logger and envVars dependencies
jest.mock("../configs/logger.config", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../configs/envVars.config", () => ({
  envVars: {
    AWS_ACCESS_KEY_ID: "",
    AWS_SECRET_ACCESS_KEY: "",
    AWS_REGION: "",
  },
}));

describe("createSQSClient", () => {
  // Test for successful client creation
  it("creates an SQS client successfully when environment variables are set", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../configs/envVars.config").envVars = {
      AWS_ACCESS_KEY_ID: "fakeKeyId",
      AWS_SECRET_ACCESS_KEY: "fakeAccessKey",
      AWS_REGION: "fakeRegion",
    };

    const response = await createSQSClient();
    expect(response.status).toBe(200);
    expect(response.message).toBe("SQSClient created");
    expect(response.data).toBeDefined();
  });

  // Test for failure when environment variables are not set
  it("throws an error when environment variables are not set", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../configs/envVars.config").envVars = {
      AWS_ACCESS_KEY_ID: "",
      AWS_SECRET_ACCESS_KEY: "",
      AWS_REGION: "",
    };

    await expect(createSQSClient()).rejects.toThrow("error in createSQSClient");
  });
});
