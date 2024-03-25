import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ValidatedHeaderData } from "../models/validatedHeaderData.type";

export default class LoginController {
  public login = (req: Request, res: Response): void => {
    (async () => {
      const userdata: ValidatedHeaderData = req.headers as ValidatedHeaderData;
      try {
        const authService = new AuthService();
        const authServiceResponse = await authService.login(
          userdata.username,
          userdata.password,
        );

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
}
