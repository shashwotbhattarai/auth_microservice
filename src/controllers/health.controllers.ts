import { Request, Response } from "express";
import logger from "../configs/logger.config";

export const healthController = (req: Request, res: Response) => {
	(async function callAuthService() {
		logger.info("Health of auth microservice is good");
		res.status(200).json({ message: "Health of auth microservice is good" });
	})();
};
