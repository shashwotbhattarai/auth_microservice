import { Request, Response } from "express";
import * as authServiceModule from "../services/auth.service";
import { signupController } from "../controllers/signup.controller";

jest.mock("../services/auth.service");

describe("signup function", () => {
  let mockRequest: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any;
  let jsonResponse: unknown;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: "validemail@example.com",
        role: "validRole",
      },
      headers: {
        username: "ram",
        password: "password",
      },
    };

    jsonResponse = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => (jsonResponse = result)),
      send: jest.fn().mockImplementation((result) => (jsonResponse = result)),
    };

    jest.clearAllMocks();

    (authServiceModule.AuthService as jest.Mock).mockImplementation(() => ({
      registerNewUser: jest.fn().mockResolvedValue({
        status: 201,
        message: "User successfully registered",
      }),
    }));
  });

  it("should return a success response when signup is successful", async () => {
    await signupController(
      mockRequest as unknown as Request,
      mockResponse as unknown as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(jsonResponse).toEqual("User successfully registered");
  });

  it("validation error", async () => {
    mockRequest = {
      body: {
        email: "validemailexample.com",
        role: "validRole",
      },
      headers: {
        username: "ram",
        password: "password",
      },
    };
    await signupController(
      mockRequest as unknown as Request,
      mockResponse as unknown as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});
