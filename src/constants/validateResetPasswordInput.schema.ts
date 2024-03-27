import Joi from "joi";
import { passwordRegex } from "./regex";

export const validateResetPasswordInput = Joi.object({
  password: Joi.string().min(8).pattern(new RegExp(passwordRegex)).required(),
});
