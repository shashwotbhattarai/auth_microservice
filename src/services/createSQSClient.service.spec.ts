import CreateSQSClientService from "../services/createSQSClient.service";

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
  it("creates an SQS client successfully when environment variables are set", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../configs/envVars.config").envVars = {
      AWS_ACCESS_KEY_ID: "fakeKeyId",
      AWS_SECRET_ACCESS_KEY: "fakeAccessKey",
      AWS_REGION: "fakeRegion",
    };

    const response = await new CreateSQSClientService().createSQSClient();

    expect(response.status).toBe(200);
    expect(response.message).toBe("SQSClient created");
    expect(response.client).toBeDefined();
  });

  it("throws an error when environment variables are not set", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../configs/envVars.config").envVars = {
      AWS_ACCESS_KEY_ID: "",
      AWS_SECRET_ACCESS_KEY: "",
      AWS_REGION: "",
    };

    await expect(
      new CreateSQSClientService().createSQSClient(),
    ).rejects.toThrow("error in createSQSClient");
  });
});
