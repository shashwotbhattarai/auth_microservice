import { Request, Response } from "express";
import logger from "../configs/logger.config";

export default class HealthController {
  public checkHealth = (req: Request, res: Response): void => {
    (async (): Promise<void> => {
      logger.info("Auth microservice is alive, on call test");
      res.status(200).json({ message: "Auth microservice is alive, on call test" });
    })();
  };
}
