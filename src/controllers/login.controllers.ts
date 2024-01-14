import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const loginController = (req: Request, res: Response) => {
	(async function callAuthService() {
		const authService = new AuthService();
		const authServiceResponse = await authService.login(req.body.username, req.body.password);

		res.status(authServiceResponse.status).json({
			message: authServiceResponse.message,
			token: authServiceResponse.token,
		});
	})();
};
