import { Request, Response } from "express";
import logger from "../configs/logger.config";

export default class HealthController {
  healthController = (req: Request, res: Response) => {
    (async function callAuthService() {
      logger.info("Auth microservice is alive");
      res.status(200).json({ message: "Auth microservice is alive" });
    })();
  };
}
