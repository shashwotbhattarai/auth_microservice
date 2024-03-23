import { Request, Response, NextFunction } from "express";
import { validateSignupInput } from "../constants/validateSignUpInput.schema";
import logger from "../configs/logger.config";
import { SignUpData } from "../models/signupData.type";
import { ValidatedHeaderData } from "../models/validatedHeaderData.type";

export const validateSignupMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headerData: ValidatedHeaderData = req.headers as ValidatedHeaderData;
  const signupDataPayload: SignUpData = {
    username: headerData.username,
    password: headerData.password,
    email: req.body.email,
    role: req.body.role,
  };
  const { error } = validateSignupInput.validate(signupDataPayload);

  if (error) {
    logger.error("Input validation error in signup controller", error);
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};
