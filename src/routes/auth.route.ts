import express, { Router } from "express";
import { signupController } from "../controllers/signup.controllers";
import { loginController } from "../controllers/login.controllers";
import { healthController } from "../controllers/health.controllers";

const router: Router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.get("/health", healthController)

export default router;
