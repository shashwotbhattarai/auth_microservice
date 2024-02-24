import { AuthCredentials } from "../models/authCredentials.model";
import jwt from "jsonwebtoken";
import { SQSService } from "./sqs.service";
import { EmailPayload } from "../interfaces/emailPayload.interface";
import logger from "../configs/logger.config";
import bcrypt from "bcrypt";
export class AuthService {
  async registerNewUser(
    newEmail: string,
    newUsername: string,
    newPassword: string,
    newRole: string,
  ) {
    console.log(newPassword);
    try {
      const result = await AuthCredentials.findOne({ username: newUsername });
      if (result === null) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const registerNewUser = new AuthCredentials({
          email: newEmail,
          username: newUsername,
          password: hashedPassword,
          role: newRole,
        });
        await registerNewUser.save();
        const emailPayload: EmailPayload = {
          to: newEmail,
          subject: "Your Account Has Been Registered",
          text: "HI " + newRole + " " + "Thank you for creating new account.",
        };

        await new SQSService().sendMessageToQueue(emailPayload);
        logger.info("New user registered");
        return {
          status: 201,
          message: "New user registered",
        };
      } else if (result instanceof AuthCredentials) {
        logger.info("username already exists");
        return {
          status: 400,
          message: "username already exists",
        };
      } else {
        logger.info("unknown error in registerNewUser");
        throw new Error("unknown error in registerNewUser");
      }
    } catch (error) {
      logger.error("error in registerNewUser", error);
      return {
        status: 500,
        message: "internal server error",
      };
    }
  }
  async login(loginUsername: string, loginPassword: string) {
    try {
      const result = await AuthCredentials.findOne({ username: loginUsername });
      if (result) {
        console.log("result", result);
        console.log(await bcrypt.compare(loginPassword, result.password));
      }

      if (
        result instanceof AuthCredentials &&
        (await bcrypt.compare(loginPassword, result.password))
      ) {
        const token = jwt.sign(
          {
            user_id: result.user_id,
            username: loginUsername,
            role: result.role,
          },
          process.env.JWTSECRET as string,
          {
            expiresIn: "1d",
          },
        );
        logger.info("User just logged in");
        return {
          status: 200,
          message: "You are loged in",
          token: token,
        };
      } else {
        logger.info("Invalid username or password");
        return {
          status: 401,
          message: "Please check your username and password",
        };
      }
    } catch (error) {
      logger.error("Error in login", error);
      throw new Error("Unknown error in login");
    }
  }
}
