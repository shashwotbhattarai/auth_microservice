import express, { Router } from "express";
import SignupController from "../controllers/signup.controller";
import LoginController from "../controllers/login.controller";
import HealthController from "../controllers/health.controller";
import InputValidationMiddleware from "../middlewares/inputValidation.middleware";
import ValidateHeaderMiddleWare from "../middlewares/validateHeaderData.middleware";
import ForgetPasswordController from "../controllers/forgotPassword.controller";
import AuthGuardMiddleware from "../middlewares/authGuard.middleware";

const validateHeaderMiddleware = new ValidateHeaderMiddleWare();
const validateHeaderForUsernameAndPassword =
  validateHeaderMiddleware.validateHeaderForUsernameAndPassword;
const validateHeaderForUsername =
  validateHeaderMiddleware.validateHeaderForUsername;
const validateHeaderForUsernameSecurityCode =
  validateHeaderMiddleware.validateHeaderForUsernameAndSecurityCode;

const inputValidationMiddleware = new InputValidationMiddleware();
const validateSignupData = inputValidationMiddleware.validateSignupData;
const validateResetPasswordData =
  inputValidationMiddleware.validateResetPasswordData;

const protectRoute = new AuthGuardMiddleware().protectRoute;
const checkHealth = new HealthController().checkHealth;

const signupController = new SignupController();
const signup = signupController.signup.bind(signupController);

const loginController = new LoginController();
const login = loginController.login.bind(loginController);

const forgetPasswordController = new ForgetPasswordController();
const emailSecurityCode = forgetPasswordController.getSecurityCode.bind(
  forgetPasswordController,
);
const verifySecurityCode = forgetPasswordController.verifySecurityCode.bind(
  forgetPasswordController,
);
const resetPassword = forgetPasswordController.resetPassword.bind(
  forgetPasswordController,
);

const router: Router = express.Router();

router.post(
  "/signup",
  validateHeaderForUsernameAndPassword,
  validateSignupData,
  signup,
);
router.post("/login", validateHeaderForUsernameAndPassword, login);
router.get(
  "/forgotPassword/getSecurityCode",
  validateHeaderForUsername,
  emailSecurityCode,
);
router.get(
  "/forgotPassword/verifySecurityCode",
  validateHeaderForUsernameSecurityCode,
  verifySecurityCode,
);
router.post(
  "/forgotPassword/resetPassword",
  protectRoute(["candidate", "recruiter"]),
  validateHeaderForUsernameAndPassword,
  validateResetPasswordData,
  resetPassword,
);
router.get("/health", checkHealth);

export default router;
