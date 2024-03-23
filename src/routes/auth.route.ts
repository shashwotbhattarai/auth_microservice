import express, { Router } from "express";
import SignupController from "../controllers/signup.controller";
import LoginController from "../controllers/login.controller";
import HealthController from "../controllers/health.controller";
import ValidateSignupMiddleware from "../middlewares/signupInputValidation.middleware";
import ValidateHeaderMiddleWare from "../middlewares/validateHeaderData.middleware";

const router: Router = express.Router();

const healthController = new HealthController().healthController;
const loginController = new LoginController().loginController;
const signupController = new SignupController().signupController;

const validateHeaderMiddleWare = new ValidateHeaderMiddleWare()
  .validateHeaderDataMiddleware;
const validateSignupMiddleware = new ValidateSignupMiddleware()
  .validateSignupMiddleware;

router.post(
  "/signup",
  validateHeaderMiddleWare,
  validateSignupMiddleware,
  signupController,
);

router.post("/login", validateHeaderMiddleWare, loginController);

router.get("/health", healthController);

export default router;
