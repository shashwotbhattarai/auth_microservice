import { Request, Response, NextFunction } from "express";
import { validateSignupInput } from "../constants/validateSignUpInput.schema";
import logger from "../configs/logger.config";
import { SignUpData } from "../models/signupData.type";
import { ValidatedHeaderWithUsernameAndPassword } from "../models/validatedHeaderData.type";
import { validateResetPasswordInput } from "../constants/validateResetPasswordInput.schema";

export default class InputValidationMiddleware {
  public validateSignupData = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const headerData: ValidatedHeaderWithUsernameAndPassword =
      req.headers as ValidatedHeaderWithUsernameAndPassword;
    const signupDataPayload: SignUpData = {
      username: headerData.username,
      password: headerData.password,
      email: req.body.email,
      role: req.body.role,
    };
    const { error } = validateSignupInput.validate(signupDataPayload);

    if (error) {
      logger.error(
        "Input validation error in InputValidationMiddleware.validateSignupData",
        error,
      );
      res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }
    next();
  };

  public validateResetPasswordData = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const headerData: ValidatedHeaderWithUsernameAndPassword =
      req.headers as ValidatedHeaderWithUsernameAndPassword;
    const resetPasswordDataPayload = {
      password: headerData.password,
    };
    const { error } = validateResetPasswordInput.validate(
      resetPasswordDataPayload,
    );

    if (error) {
      logger.error(
        "Input validation error in InputValidationMiddleware.validateResetPasswordData",
        error,
      );
      res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }
    next();
  };
}
