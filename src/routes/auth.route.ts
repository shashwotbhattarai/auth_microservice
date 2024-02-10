import express, { Router } from "express";
import { signupController } from "../controllers/signup.controller";
import { loginController } from "../controllers/login.controller";
import { healthController } from "../controllers/health.controller";

const router: Router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.get("/health", healthController);

export default router;
