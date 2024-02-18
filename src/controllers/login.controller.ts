import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const loginController = (req: Request, res: Response) => {
	(async function callAuthService() {
		try {
			const username:string  = req.headers.username as string;
			const password:string = req.headers.password as string;
			const authService = new AuthService();
			const authServiceResponse = await authService.login(username,password);

			res.status(authServiceResponse.status).json({
				message: authServiceResponse.message,
				token: authServiceResponse.token,
			});
		} catch {
			res.status(500).json({
				error: "internal server error",
			});
		}
	})();
};
