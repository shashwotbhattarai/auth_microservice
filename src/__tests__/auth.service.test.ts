import { AuthService } from "../services/auth.service";
import { AuthCredentials } from "../database/models/authCredentials.model";
import { SQS_Service } from "../services/sqs.service";
const mockingoose = require("mockingoose");

describe("registerNewUser", () => {
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
		const sendMessageToQueueMock = jest
			.spyOn(SQS_Service.prototype, "sendMessageToQueue")
			.mockResolvedValue({ status: 200, message: "message sent" });
		const authService = new AuthService();
		const finalResult = await authService.registerNewUser(
			"test@example.com",
			"testUser",
			"password123",
			"user"
		);

		expect(finalResult.status).toBe(201);
	});
	test("if username  exists in database, respond with 400 error", async () => {
		//mock all dependencies
		mockingoose(AuthCredentials).toReturn({ id: 1 }, "findOne");
		const authService = new AuthService();
		const finalResult = await authService.registerNewUser(
			"test@example.com",
			"testUser",
			"password123",
			"user"
		);

		expect(finalResult.status).toBe(400);
	});
});
