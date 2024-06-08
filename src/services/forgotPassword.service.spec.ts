import ForgotPasswordService from "./forgotPassword.service";
import { AuthCredentials } from "../entities/authCredentials.entity";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");

jest.mock("./sqs.service", () => {
  return {
    SQSService: jest.fn().mockImplementation(() => {
      return { sendMessageToQueue: jest.fn() };
    }),
  };
});
jest.mock("../configs/logger.config", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("ForgotPasswordService", () => {
  let forgotPasswordService: ForgotPasswordService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUser: any;

  beforeEach(() => {
    forgotPasswordService = new ForgotPasswordService();
    mockUser = {
      user_id: "123",
      username: "john.doe",
      email: "john.doe@example.com",
      role: "user",
    };

    jest.clearAllMocks();
  });

  describe("emailSecurityCode", () => {
    it("should send a security code email if user exists", async () => {
      mockingoose(AuthCredentials).toReturn({ id: 1 }, "findOne");

      const response =
        await forgotPasswordService.emailSecurityCode("john.doe");

      expect(response).toEqual({
        status: 200,
        message: "Password Reset Code sent in Email",
      });
    });

    it("should return a 404 error if user does not exist", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");

      const response =
        await forgotPasswordService.emailSecurityCode("john.doe");

      expect(response).toEqual({
        status: 404,
        message: "User not found",
      });
    });

    it("should return a 500 error if there is an unexpected error", async () => {
      mockingoose(AuthCredentials).toReturn(
        new Error("Unexpected error"),
        "findOne",
      );

      const response =
        await forgotPasswordService.emailSecurityCode("john.doe");

      expect(response).toEqual({
        status: 500,
        message: "Internal Server Error",
      });
    });
  });
  describe("verifySecurityCode", () => {
    it("should verify the security code and return a token on success", async () => {
      const mockUserWithSecurityCode = { ...mockUser, securityCode: "12345" };
      mockingoose(AuthCredentials).toReturn(
        mockUserWithSecurityCode,
        "findOne",
      );

      const response = await forgotPasswordService.verifySecurityCode(
        "john.doe",
        "12345",
      );

      expect(response.status).toBe(200);
      expect(response.message).toContain("Please Enter New Password");
      expect(response.token).toBeDefined();
    });

    it("should return a 400 error if the security code is incorrect", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");

      const response = await forgotPasswordService.verifySecurityCode(
        "john.doe",
        "wrong-code",
      );

      expect(response).toEqual({
        status: 400,
        message: "Bad Request",
      });
    });

    it("should handle errors gracefully", async () => {
      mockingoose(AuthCredentials).toReturn(new Error("Test error"), "findOne");

      const response = await forgotPasswordService.verifySecurityCode(
        "john.doe",
        "12345",
      );

      expect(response).toEqual({
        status: 500,
        message: "Internal Server Error",
      });
    });
  });

  describe("resetPassword", () => {
    it("should successfully reset the user's password", async () => {
      mockingoose(AuthCredentials).toReturn(mockUser, "findOne");
      mockingoose(AuthCredentials).toReturn(mockUser, "findOneAndUpdate");

      const response = await forgotPasswordService.resetPassword(
        "john.doe",
        "newPassword123",
      );

      expect(response).toEqual({
        status: 200,
        message: "Password Reset Successfully",
      });
    });

    it("should return a 404 error if the user does not exist", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");

      const response = await forgotPasswordService.resetPassword(
        "nonexistent.user",
        "newPassword123",
      );

      expect(response).toEqual({
        status: 404,
        message: "User not found",
      });
    });

    it("should handle errors gracefully during the reset process", async () => {
      mockingoose(AuthCredentials).toReturn(new Error("Test error"), "findOne");

      const response = await forgotPasswordService.resetPassword(
        "john.doe",
        "newPassword123",
      );

      expect(response).toEqual({
        status: 500,
        message: "Internal Server Error",
      });
    });
  });
});
