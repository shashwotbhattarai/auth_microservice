import { Request, Response } from "express";
import * as authServiceModule from "../services/auth.service";
import { signup } from "../services/signup.service";

jest.mock("../services/auth.service");

describe("signup function", () => {
	let mockRequest: any;
	let mockResponse: any;
	let jsonResponse: any;

	beforeEach(() => {
		mockRequest = {
			body: {
				email: "validemail@example.com",
				username: "validUsername",
				password: "validPassword",
				role: "validRole",
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
		await signup(mockRequest as unknown as Request, mockResponse as unknown as Response);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(jsonResponse).toEqual("User successfully registered");
	});

	it("validation error", async () => {
		mockRequest = {
			body: {
				email: "validemailexample.com",
				username: "validUsername",
				password: "validPassword",
				role: "validRole",
			},
		};
		await signup(mockRequest as unknown as Request, mockResponse as unknown as Response);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
	});
});
