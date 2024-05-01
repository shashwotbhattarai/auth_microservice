import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ValidatedHeaderWithUsernameAndPassword } from "../models/validatedHeaderData.type";

export default class LoginController {
  private authService = new AuthService();

  public login = (req: Request, res: Response): void => {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;
      try {
        const authServiceResponse = await this.authService.login(
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
