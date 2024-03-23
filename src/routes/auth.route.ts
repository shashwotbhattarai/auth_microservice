import express, { Router } from "express";
import { signupController } from "../controllers/signup.controller";
import { loginController } from "../controllers/login.controller";
import { healthController } from "../controllers/health.controller";
import { validateSignupMiddleware } from "../middlewares/signupInputValidation.middleware";
import checkHeaderMiddleware from "../middlewares/validateHeaderData.middleware";

const router: Router = express.Router();

router.post(
  "/signup",
  checkHeaderMiddleware,
  validateSignupMiddleware,
  signupController,
);

router.post("/login", checkHeaderMiddleware, loginController);

router.get("/health", healthController);

export default router;
