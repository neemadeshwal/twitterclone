import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWTUSER } from "../interfaces";
import { JWT_SECRET } from "../utils/constants";

class JWTService {
  public static generateTokenFromUser(user: User) {
    const payload: JWTUSER = {
      id: user?.id,
      email: user?.email,
    };

    const token = jwt.sign(payload, JWT_SECRET!);
    return token;
  }

  public static decodeToken(token: string) {
    const user = jwt.verify(token, JWT_SECRET!);
    return user;
  }
}

export default JWTService;
