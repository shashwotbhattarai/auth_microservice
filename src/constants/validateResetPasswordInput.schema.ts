import Joi from "joi";
import { pwRegex } from "./regex";

export const validateResetPasswordInput = Joi.object({
  password: Joi.string().min(8).pattern(new RegExp(pwRegex)).required(),
});
