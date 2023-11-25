import { AuthCredentials } from "../database/models/authCredentials.model";
import jwt from "jsonwebtoken";
import { SQS_Service } from "./sqs.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";

export class AuthService {
	async registerNewUser(newEmail: string, newUsername: string, newPassword: string, newRole: string) {
		try {
			const result = await AuthCredentials.findOne({ username: newUsername });
			if (result == null) {
				const registerNewUser = new AuthCredentials({
					email: newEmail,
					username: newUsername,
					password: newPassword,
					role: newRole,
				});
				await registerNewUser.save();
				const emailPayload: EmailPayload = {
					to: newEmail,
					subject: "Your Account Has Been Registered",
					text: "HI " + newRole + " " + "Thank you for creating new account.",
				};
				await new SQS_Service().sendMessageToQueue(emailPayload);
				return {
					status: 201,
					message: "New user registered",
				};
			} else {
				return {
					status: 400,
					message: "username already exists",
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error,
			};
		}
	}
	async login(loginUsername: string, loginPassword: string) {
		try {
			const result = await AuthCredentials.findOne({ username: loginUsername });

			if (result !== null && loginPassword == result.password) {
				const token = jwt.sign(
					{
						user_id: result.user_id,
						username: loginUsername,
						role: result.role,
					},
					process.env.JWTSECRET as string,
					{
						expiresIn: "1d",
					}
				);

				return {
					status: 200,
					message: { token: token },
				};
			} else {
				return {
					status: 401,
					message: "please check your username and password",
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: error,
			};
		}
	}
}
