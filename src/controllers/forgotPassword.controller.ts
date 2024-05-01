import { Request, Response } from "express";
import {
  ValidatedHeaderWithSecurityCode,
  ValidatedHeaderWithUsernameAndPassword,
} from "../models/validatedHeaderData.type";
import ForgotPasswordService from "../services/forgotPassword.service";

export default class ForgotPasswordController {
  private forgetPasswordService = new ForgotPasswordService();

  public getSecurityCode(req: Request, res: Response): void {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;

      const response = await this.forgetPasswordService.emailSecurityCode(
        userdata.username,
      );

      res.status(response.status).send(response.message);
    })();
  }

  public verifySecurityCode(req: Request, res: Response): void {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithSecurityCode =
        req.headers as ValidatedHeaderWithSecurityCode;

      const response = await this.forgetPasswordService.verifySecurityCode(
        userdata.username,
        userdata.securitycode,
      );

      res
        .status(response.status)
        .send({ message: response.message, token: response.token });
    })();
  }

  public resetPassword(req: Request, res: Response): void {
    (async (): Promise<void> => {
      const userdata: ValidatedHeaderWithUsernameAndPassword =
        req.headers as ValidatedHeaderWithUsernameAndPassword;

      const response = await this.forgetPasswordService.resetPassword(
        userdata.username,
        userdata.password,
      );

      res.status(response.status).send(response.message);
    })();
  }
}
