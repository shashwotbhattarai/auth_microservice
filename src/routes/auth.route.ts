import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateSignupInput } from "../validators/signup.validate";

const router: Router = express.Router();

router.post("/signup", (req: Request, res: Response) => {
	console.log("inside signup route");
	console.log(req.body);
	const { error } = validateSignupInput.validate(req.body);

	if (error) {
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
});

router.post("/login", (req: Request, res: Response) => {
	(async function callAuthService() {
		const authService = new AuthService();
		const authServiceResponse = await authService.login(req.body.username, req.body.password);

		res.status(authServiceResponse.status).json({
			message: authServiceResponse.message,
			token: authServiceResponse.token,
		});
	})();
});

export default router;
