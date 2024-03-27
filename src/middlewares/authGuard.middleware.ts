import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../configs/logger.config";
import { envVars } from "../configs/envVars.config";

export default class AuthGuardMiddleware {
  public protectRoute(allowedRoles: Array<string>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        logger.info("Authorization header missing");
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = req.headers.authorization.slice(7);
      if (token === "") {
        logger.info("Access token is missing");
        return res.status(401).json({ message: "Access token is missing" });
      }

      const decoded = jwt.verify(token, envVars.JWTSECRET as string) as {
        role: string;
      };

      const userRole = decoded.role;

      if (!allowedRoles.includes(userRole)) {
        logger.info("Access denied");
        return res.status(403).json({ message: "Access denied" });
      }
      logger.info("Access granted");
      next();
    };
  }
}
