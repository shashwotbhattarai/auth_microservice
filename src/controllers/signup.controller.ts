import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ValidatedHeaderWithUsernameAndPassword } from "../models/validatedHeaderData.type";

export default class LoginController {
  public signup = (req: Request, res: Response): void => {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;
      const authService = new AuthService();
      const authServiceResponse = await authService.registerNewUser(
        req.body.email,
        userdata.username,
        userdata.password,
        req.body.role,
      );

      res.status(authServiceResponse.status).send(authServiceResponse.message);
    })();
  };
}
