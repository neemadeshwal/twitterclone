import passport from "passport";

import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import { CALLBACK_URL, CLIENT_ID, CLIENT_SECRET } from "../utils/constants";
console.log(CALLBACK_URL, CLIENT_ID, CLIENT_SECRET);
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID!,
      clientSecret: CLIENT_SECRET!,
      callbackURL: CALLBACK_URL!,
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      return done(null, profile);
    }
  )
);

export default passport;
