import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateSignupInput } from "../validators/signup.validate";
import logger from "../configs/logger";

export const signupController = (req: Request, res: Response) => {
	const { error } = validateSignupInput.validate(req.body);

	if (error) {
		logger.error("Input validation error in signup controller", error);
		return res.status(400).json({ error: error.details[0].message });
	}

	(async function callAuthService() {
		const authService = new AuthService();
		const authServiceResponse = await authService.registerNewUser(
			req.body.email,
			req.body.username,
			req.body.password,
			req.body.role
		);

		res.status(authServiceResponse.status).send(authServiceResponse.message);
	})();
};
