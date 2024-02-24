import { AuthService } from "../services/auth.service";
import { AuthCredentials } from "../models/authCredentials.model";
import { SQSService } from "../services/sqs.service";
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

    test("if database call gets results in an error", async () => {
      //mock all dependencies
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

      expect(finalResult?.status).toBe(500);
    });

    test("if username doesnt exists in database, new user is created and annd email is sent", async () => {
      //mock all dependencies
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
    test("if username  exists in database, respond with 400 error", async () => {
      //mock all dependencies
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
    test("if unexpected error oocurs", async () => {
      //mock all dependencies
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
    test("if database call gets results in an error", async () => {
      //mock all dependencies
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
    test("login in when valid username and password is passed", async () => {
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

    test("error when valid password is not passed", async () => {
      mockingoose(AuthCredentials).toReturn(
        {
          username: "ram",
          password:
            "$2b$10$yz1qJF8UH6two7Zm8S5EKOTOWGw6jJ9t5Zxsaaki6kKKQVwTrhW9u",
        },
        "findOne",
      );
      jest.spyOn(jwt, "sign");
      const authService = new AuthService();
      const finalResult = await authService.login("ram", "password1");

      expect(finalResult?.status).toBe(401);
      expect(finalResult?.message).toBe(
        "Please check your username and password",
      );
    });

    test("error when valid username is not passed", async () => {
      mockingoose(AuthCredentials).toReturn(null, "findOne");
      jest.spyOn(jwt, "sign");
      try {
        const authService = new AuthService();
        await authService.login("ram", "password");
      } catch (error) {
        expect(error).toEqual(new Error("database error"));
      }
    });
    test("if database call gets results in an error", async () => {
      //mock all dependencies
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
