import { Request, Response, NextFunction } from "express";

export default class ValidateHeaderDataMiddleware {
  public validateHeaderData = (
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
    }
    next();
  };
}
