import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateSignupInput } from "../validators/signup.validate";
import logger from "../configs/logger.config";

export const signupController = (req: Request, res: Response) => {
  const username: string = req.headers.username as string;
  const password: string = req.headers.password as string;

  const { error } = validateSignupInput.validate({
    username,
    password,
    ...req.body,
  });

  if (error) {
    logger.error("Input validation error in signup controller", error);
    return res.status(400).json({ error: error.details[0].message });
  }

  (async function callAuthService() {
    const authService = new AuthService();
    const authServiceResponse = await authService.registerNewUser(
      req.body.email,
      username,
      password,
      req.body.role,
    );

    res.status(authServiceResponse.status).send(authServiceResponse.message);
  })();
};
