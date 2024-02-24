import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import logger from "../configs/logger.config";

export const loginController = (req: Request, res: Response) => {
  (async function callAuthService() {
    const username: string = req.headers.username as string;
    const password: string = req.headers.password as string;
    try {
      if (!username && !password) {
        logger.error("Didnt receive username and password in headers");
        return res
          .status(400)
          .json({ error: "Didnt receive username and password in headers" });
      }

      const authService = new AuthService();
      const authServiceResponse = await authService.login(username, password);

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
