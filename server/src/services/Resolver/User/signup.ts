import { prismaClient } from "../../../client/db";
import { BadRequestError, NotFoundError } from "../../../error/errors";
import { getRandomDarkHexColor } from "../../../utils/getRandomColor";
import { hashPassword } from "../../../utils/hashPassword";
import { sendOtp } from "../../../utils/nodemailer";
import { redis } from "../../../utils/redis/redis";
import {
  createAccountPayload,
  getCredAndSendOtpPayload,
  verifyOtpPayload,
} from "../../../utils/types";
import JWTService from "../../jwt";

class SignUpUserService {
  public static async getCredAndSendOtp(payload: getCredAndSendOtpPayload) {
    const { firstName, lastName, dateOfBirth, email } = payload;

    if (!firstName || !email) {
      throw new BadRequestError("Please provide required credentials");
    }

    try {
      const user = await prismaClient.user.findUnique({
        where: { email: email },
      });
      if (user) {
        throw new BadRequestError("User already exists. Please login");
      }
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw new Error("Internal server error while checking user existence.");
    }

    const data = { email, firstName, lastName, dateOfBirth };
    const expiryTime = 60 * 60 * 24;

    try {
      await redis.set(
        `unverifiedUser:${email}`,
        JSON.stringify(data),
        "EX",
        expiryTime
      );
    } catch (error) {
      console.error("Error saving data to Redis:", error);
      throw new Error("Internal server error while saving user data.");
    }

    try {
      await redis.get(`unverifiedUser:${email}`);
      await sendOtp(email);
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP. Please try again.");
    }

    return { email };
  }

  public static async verifyOtp(payload: verifyOtpPayload) {
    const { email, otp, authType } = payload;

    if (!email || !otp) {
      throw new NotFoundError("Please provide required credentials");
    }

    let user;
    try {
      user = await prismaClient.user.findUnique({
        where: { email: email },
      });
    } catch (error) {
      console.error(
        "Error checking user existence during OTP verification:",
        error
      );
      throw new Error("Internal server error while verifying OTP.");
    }

    if (user && authType === "createaccount") {
      throw new BadRequestError("User already exists. Please login");
    }

    let storedOtp;
    try {
      storedOtp = await redis.get(`Otp/:${email}`);
    } catch (error) {
      console.error("Error retrieving OTP from Redis:", error);
      throw new Error("Internal server error while fetching OTP.");
    }

    if (!storedOtp) {
      throw new BadRequestError(
        "No OTP or OTP expired. Please request a new OTP to verify your account."
      );
    }

    const storedOtpCred = JSON.parse(storedOtp);
    if (storedOtpCred.otp !== Number(otp)) {
      throw new BadRequestError("Invalid OTP! Please enter the correct OTP.");
    }

    let oldData;
    try {
      oldData = await redis.get(`unverifiedUser:${email}`);
    } catch (error) {
      console.error("Error retrieving unverified user data from Redis:", error);
      throw new Error("Internal server error while fetching user data.");
    }

    if (!oldData) {
      throw new Error("Error occurred. Please re-enter your credentials.");
    }

    const newData = JSON.stringify({ ...JSON.parse(oldData), verified: true });
    try {
      await redis.set(`verifiedUser:${email}`, newData);
    } catch (error) {
      console.error("Error saving verified user data to Redis:", error);
      throw new Error("Internal server error while saving verified user data.");
    }

    const nextPage = authType === "forgotpass" ? "newpass" : "password";
    return { email, nextPage };
  }

  public static async createAccount(payload: createAccountPayload) {
    const { email, password } = payload;

    if (!email || !password) {
      throw new NotFoundError("Please provide required credentials");
    }

    let getVerifiedUser;
    try {
      getVerifiedUser = await redis.get(`verifiedUser:${email}`);
    } catch (error) {
      console.error("Error retrieving verified user data from Redis:", error);
      throw new Error(
        "Internal server error while fetching verified user data."
      );
    }

    if (!getVerifiedUser) {
      throw new BadRequestError(
        "No user present. Please verify your account first."
      );
    }

    const parsedVerifiedUser = JSON.parse(getVerifiedUser);

    let user;
    try {
      user = await prismaClient.user.findUnique({ where: { email } });
    } catch (error) {
      console.error(
        "Error checking if user exists during account creation:",
        error
      );
      throw new Error("Internal server error while checking user existence.");
    }

    if (user) {
      throw new BadRequestError("User already exists. Please login.");
    }

    let userName;
    try {
      const existingUserName = await prismaClient.user.findUnique({
        where: {
          userName: `${parsedVerifiedUser.lastName ?? "_"}${
            parsedVerifiedUser.firstName
          }`,
        },
      });

      if (existingUserName) {
        userName = `${existingUserName.userName}${Math.floor(
          Math.random() * 20
        )}`;
      } else {
        userName = `${parsedVerifiedUser.lastName ?? "_"}${
          parsedVerifiedUser.firstName
        }`;
      }
    } catch (error) {
      console.error("Error checking username uniqueness:", error);
      throw new Error("Internal server error while generating username.");
    }

    const hashedPassword = await hashPassword(password);

    let formattedDate;
    try {
      let [month, day, year] = parsedVerifiedUser.dateOfBirth.split("/");
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T00:00:00Z`;
    } catch (error) {
      console.error("Error formatting date of birth:", error);
      throw new Error("Invalid date of birth format.");
    }

    let newUser;
    try {
      newUser = await prismaClient.user.create({
        data: {
          email,
          firstName: parsedVerifiedUser.firstName,
          lastName: parsedVerifiedUser.lastName ?? "",
          userName,
          dateOfBirth: formattedDate,
          password: hashedPassword,
          profileImgUrl: getRandomDarkHexColor(),
        },
      });
    } catch (error) {
      console.error("Error creating new user:", error);
      throw new Error("Internal server error while creating the user.");
    }

    let token;
    try {
      token = await JWTService.generateTokenFromUser(newUser);
    } catch (error) {
      console.error("Error generating JWT token:", error);
      throw new Error("Internal server error while generating token.");
    }

    return { token };
  }

  public static async resendOtp(payload: { email: string }) {
    const { email } = payload;

    if (!email) {
      throw new BadRequestError("Provide required credentials.");
    }

    try {
      await sendOtp(email);
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw new Error("Failed to resend OTP. Please try again.");
    }

    return { email };
  }
}

export default SignUpUserService;
