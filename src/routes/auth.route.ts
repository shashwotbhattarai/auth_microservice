import express, { Router } from "express";
import SignupController from "../controllers/signup.controller";
import LoginController from "../controllers/login.controller";
import HealthController from "../controllers/health.controller";
import ValidateSignupMiddleware from "../middlewares/signupInputValidation.middleware";
import ValidateHeaderMiddleWare from "../middlewares/validateHeaderData.middleware";

const router: Router = express.Router();

const checkHealth = new HealthController().checkHealth;
const login = new LoginController().login;
const signup = new SignupController().signup;

const validateHeader = new ValidateHeaderMiddleWare().validateHeaderData;
const validateSignup = new ValidateSignupMiddleware().validateSignup;

router.post("/signup", validateHeader, validateSignup, signup);
router.post("/login", validateHeader, login);
router.get("/health", checkHealth);

export default router;
