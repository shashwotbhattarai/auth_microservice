import express, { Router } from "express";
import { signup } from "../services/signup.service";
import { login } from "../services/login.service";

const router: Router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
