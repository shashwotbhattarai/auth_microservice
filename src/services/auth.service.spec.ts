import { AuthService } from "./auth.service";
import { AuthCredentials } from "../entities/authCredentials.entity";
import { SQSService } from "./sqs.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");
import jwt from "jsonwebtoken";

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerNewUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("if database call results in an error", async () => {
      mockingoose(AuthCredentials).toReturn(
        new Error("Database error"),
        "findOne",
      );
      const authService = new AuthService();
      const finalResult = await authService.registerNewUser(
        "test@example.com",
        "testUser",
        "password123",
        "user",
      );

      expect(finalResult?.status).toBe(200);
    });

    it("if username doesnt exists in database, new user is created and annd email is sent", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");
      jest.mock("../services/sqs.service", () => {
        return {
          SQS_Service: jest.fn().mockImplementation(() => ({
            sendMessageToQueue: jest.fn(),
          })),
        };
      });
      jest.spyOn(SQSService.prototype, "sendMessageToQueue").mockResolvedValue({
        status: 200,
        message: "message sent",
      });
      const authService = new AuthService();
      const finalResult = await authService.registerNewUser(
        "test@example.com",
        "testUser",
        "password123",
        "user",
      );

      expect(finalResult?.status).toBe(201);
      expect(finalResult?.message).toBe("New user registered");
    });

    it("if username  exists in database, respond with 400 error", async () => {
      mockingoose(AuthCredentials).toReturn({ id: 1 }, "findOne");
      const authService = new AuthService();
      const finalResult = await authService.registerNewUser(
        "test@example.com",
        "testUser",
        "password123",
        "user",
      );

      expect(finalResult?.status).toBe(400);
      expect(finalResult?.message).toBe("username already exists");
    });

    it("if unexpected error occurs", async () => {
      mockingoose(AuthCredentials).toReturn(undefined, "findOne");
      const authService = new AuthService();
      const finalResult = await authService.registerNewUser(
        "test@example.com",
        "testUser",
        "password123",
        "user",
      );

      expect(finalResult?.status).toBe(500);
    });
  });

  describe("login", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("if database call gets results in an error", async () => {
      mockingoose(AuthCredentials).toReturn(
        new Error("Database error"),
        "findOne",
      );
      try {
        const authService = new AuthService();
        await authService.login("ram", "password");
      } catch (error) {
        expect(error).toEqual(new Error("Unknown error in login"));
      }
    });

    it("login in when valid username and password is passed", async () => {
      mockingoose(AuthCredentials).toReturn(
        {
          username: "ram",
          password:
            "$2b$10$yz1qJF8UH6two7Zm8S5EKOTOWGw6jJ9t5Zxsaaki6kKKQVwTrhW9u",
        },
        "findOne",
      );
      const signSpy = jest.spyOn(jwt, "sign");
      signSpy.mockImplementation(() => "mocked-token");
      const authService = new AuthService();
      const finalResult = await authService.login("ram", "password");

      expect(finalResult?.status).toBe(200);
      expect(finalResult?.token).toBe("mocked-token");
    });

    it("error when valid password is not passed", async () => {
      mockingoose(AuthCredentials).toReturn(
        {
          username: "ram",
          password:
            "$2b$10$yz1qJF8UH6two7Zm8S5EKOTOWGw6jJ9t5Zxsaaki6kKKQVwTrhW9u",
        },
        "findOne",
      );
      const authService = new AuthService();
      const finalResult = await authService.login("ram", "password1");

      expect(finalResult?.status).toBe(401);
      expect(finalResult?.message).toBe(
        "Please check your username and password",
      );
    });

    it("error when valid username is not passed", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");
      jest.spyOn(jwt, "sign");
      try {
        const authService = new AuthService();
        await authService.login("ram", "password");
      } catch (error) {
        expect(error).toEqual(new Error("database error"));
      }
    });

    it("if database call gets results in an error", async () => {
      mockingoose(AuthCredentials).toReturn(undefined, "findOne");
      try {
        const authService = new AuthService();
        await authService.login("ram", "password");
      } catch (error) {
        expect(error).toEqual(new Error("database error"));
      }
    });
  });
});
