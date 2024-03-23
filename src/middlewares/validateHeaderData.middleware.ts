import { Request, Response, NextFunction } from "express";

const validateHeaderDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(401).send({
      message:
        "Either Username or password is missing or the data type is not string",
    });
  }
  next();
};

export default validateHeaderDataMiddleware;
