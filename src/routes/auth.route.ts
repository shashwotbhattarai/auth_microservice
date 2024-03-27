import express, { Router } from "express";
import SignupController from "../controllers/signup.controller";
import LoginController from "../controllers/login.controller";
import HealthController from "../controllers/health.controller";
import InputValidationMiddleware from "../middlewares/inputValidation.middleware";
import ValidateHeaderMiddleWare from "../middlewares/validateHeaderData.middleware";
import ForgetPasswordController from "../controllers/ForgetPassword.controller";
import AuthGuardMiddleware from "../middlewares/authGuard.middleware";

const validateHeaderForUsernameAndPassword = new ValidateHeaderMiddleWare()
  .validateHeaderForUsernameAndPassword;
const validateHeaderForUsername = new ValidateHeaderMiddleWare()
  .validateHeaderForUsername;
const validateHeaderForUsernameSecurityCode = new ValidateHeaderMiddleWare()
  .validateHeaderForUsernameAndSecurityCode;
const validateSignupData = new InputValidationMiddleware().validateSignupData;
const validateResetPasswordData = new InputValidationMiddleware()
  .validateResetPasswordData;
const protectRoute = new AuthGuardMiddleware().protectRoute;

const checkHealth = new HealthController().checkHealth;
const login = new LoginController().login;
const signup = new SignupController().signup;
const emailSecurityCode = new ForgetPasswordController().getSecurityCode;
const verifySecurityCode = new ForgetPasswordController().verifySecurityCode;
const resetPassword = new ForgetPasswordController().resetPassword;

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
