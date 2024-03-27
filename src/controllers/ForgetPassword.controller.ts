import { Request, Response } from "express";
import {
  ValidatedHeaderWithSecurityCode,
  ValidatedHeaderWithUsernameAndPassword,
} from "../models/validatedHeaderData.type";
import ForgotPasswordService from "../services/forgotPassword.service";

export default class ForgetPasswordController {
  public async getSecurityCode(req: Request, res: Response): Promise<void> {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;

      const response = await new ForgotPasswordService().emailSecurityCode(
        userdata.username,
      );

      res.status(response.status).send(response.message);
    })();
  }

  public async verifySecurityCode(req: Request, res: Response): Promise<void> {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithSecurityCode =
        req.headers as ValidatedHeaderWithSecurityCode;

      const response = await new ForgotPasswordService().verifySecurityCode(
        userdata.username,
        userdata.securitycode,
      );

      res
        .status(response.status)
        .send({ message: response.message, token: response.token });
    })();
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;

      const response = await new ForgotPasswordService().resetPassword(
        userdata.username,
        userdata.password,
      );

      res.status(response.status).send(response.message);
    })();
  }
}
