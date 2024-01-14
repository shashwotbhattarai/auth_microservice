import { Request, Response } from "express";
import * as authServiceModule from "../services/auth.service";
import { login } from "../services/login.service";

jest.mock("../services/auth.service");

describe("login function", () => {
	let mockRequest: any;
	let mockResponse: any;
	let jsonResponse: any;

	beforeEach(() => {
		mockRequest = {
			body: {
				username: "testuser",
				password: "testpassword",
			},
		};

		jsonResponse = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockImplementation((result) => {
				jsonResponse = result;
			}),
		};

		jest.clearAllMocks();

		(authServiceModule.AuthService as jest.Mock).mockImplementation(() => {
			return {
				login: jest.fn().mockResolvedValue({
					status: 200,
					message: "Login successful",
					token: "testToken",
				}),
			};
		});
	});

	it("should return a success response when login is successful", async () => {
		await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(jsonResponse).toEqual({
			message: "Login successful",
			token: "testToken",
		});
	});
});
