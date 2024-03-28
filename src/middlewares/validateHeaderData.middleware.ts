import { Request, Response, NextFunction } from "express";

export default class ValidateHeaderDataMiddleware {
  public validateHeaderForUsernameAndPassword = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const username = req.headers.username;
    const password = req.headers.password;

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      next();
    }
  };

  public validateHeaderForUsername = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const username = req.headers.username;

    if (typeof username !== "string" || username === undefined) {
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      next();
    }
  };

  public validateHeaderForUsernameAndSecurityCode = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const securityCode = req.headers.securitycode;
    const username = req.headers.username;

    if (typeof securityCode !== "string" || typeof username !== "string") {
      res.status(401).send({
        message: "Invalid credentials",
      });
    } else {
      next();
    }
  };
}
