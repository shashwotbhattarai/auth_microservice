import { envVars } from "../configs/envVars.config";
import logger from "../configs/logger.config";
import { SendEmailStatusEnum } from "../constants/sendEmailStatus.enum";
import { AuthCredentials } from "../entities/authCredentials.entity";
import { ServiceResponse } from "../models/serviceResponse.type";
import { EmailerService } from "./emailer.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rn = require("random-number");

export default class ForgotPasswordService {
  private emailService = new EmailerService();

  public async emailSecurityCode(username: string): Promise<ServiceResponse> {
    try {
      const user = await AuthCredentials.findOne({ username: username });

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      const options = {
        min: 0,
        max: 99999,
        integer: true,
      };

      const randomNumber: number = rn(options);
      const randomNumberString: string = randomNumber.toString();

      await AuthCredentials.findOneAndUpdate(
        { username: username },
        { securityCode: randomNumberString },
        { updatedBy: user.user_id },
      );

      this.emailService.sendEmail(
        user.email,
        username,
        SendEmailStatusEnum.FORGOT_PASSWORD,
        randomNumberString,
      );
      logger.info("Password Reset Code sent in Email");

      return {
        status: 200,
        message: "Password Reset Code sent in Email",
      };
    } catch (error) {
      logger.error("Unknown Error in emailSecurityCode", error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  }

  public async verifySecurityCode(
    username: string,
    securityCode: string,
  ): Promise<ServiceResponse> {
    try {
      const user = await AuthCredentials.findOne({
        username: username,
        securityCode: securityCode,
      });

      if (!user) {
        return {
          status: 400,
          message: "Bad Request",
        };
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
        },
        envVars.JWTSECRET as string,
        {
          expiresIn: "1d",
        },
      );

      return {
        status: 200,
        message: "Security code verified, Please Enter New Password",
        token: token,
      };
    } catch (error) {
      logger.error("Unknown Error in emailSecurityCode", error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  }

  public async resetPassword(
    username: string,
    newPassword: string,
  ): Promise<ServiceResponse> {
    try {
      const user = await AuthCredentials.findOne({ username: username });
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await AuthCredentials.findOneAndUpdate(
        { username: username },
        { username: username, password: hashedPassword },
        { updatedBy: user.user_id },
      );
      logger.info("Password Reset Successfully");
      return {
        status: 200,
        message: "Password Reset Successfully",
      };
    } catch (error) {
      logger.error("Unknown Error in resetPassword", error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  }
}
