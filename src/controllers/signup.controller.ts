import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ValidatedHeaderData } from "../models/validatedHeaderData.type";

export const signupController = (req: Request, res: Response) => {
  (async () => {
    const userdata: ValidatedHeaderData =
      req.headers as unknown as ValidatedHeaderData;
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
