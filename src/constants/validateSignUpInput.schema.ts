import Joi from "joi";
import { passwordRegex, usernameRegex } from "../constants/regex";

export const validateSignupInput = Joi.object({
  username: Joi.string().pattern(new RegExp(usernameRegex)).required(),
  password: Joi.string().min(8).pattern(new RegExp(passwordRegex)).required(),
  email: Joi.string().email().required(),
  role: Joi.string().min(9).max(9),
});
