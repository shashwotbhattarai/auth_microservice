import { AuthCredentials } from "../database/models/authCredentials.model";
import jwt from "jsonwebtoken";
import { SQSService } from "./sqs.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";

export class AuthService {
	async registerNewUser(newEmail: string, newUsername: string, newPassword: string, newRole: string) {
		try {
			const result = await AuthCredentials.findOne({ username: newUsername });
			if (result === null) {
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

				await new SQSService().sendMessageToQueue(emailPayload);
				return {
					status: 201,
					message: "New user registered",
				};
			} else if (result instanceof AuthCredentials) {
				return {
					status: 400,
					message: "username already exists",
				};
			} else {
				return {
					status: 500,
					message: "internal server error",
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

			if (result instanceof AuthCredentials && loginPassword == result.password) {
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
					message: "you are loged in",
					token: token,
				};
			} else if (result instanceof AuthCredentials && loginPassword != result.password) {
				return {
					status: 401,
					message: "please check your username and password",
				};
			} else if (result === null) {
				return {
					status: 401,
					message: "username not found",
				};
			} else {
				return {
					status: 500,
					message: "internal server error",
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
