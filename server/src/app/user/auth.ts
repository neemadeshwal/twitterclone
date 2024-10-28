import Express from "express";
import passport from "../../services/passport";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";

const router = Express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req: any, res) => {
    console.log(req.user);

    const email = req.user && req.user.email;
    console.log(email, "email");
    if (email === "" || "undefined" || null) {
      console.log("heyy try");
      throw new Error("no email please try again.");
    }

    const exisitingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (exisitingUser) {
      const token = await JWTService.generateTokenFromUser(exisitingUser);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("http://localhost:5000");
    }
    const firstName = req.user.name.givenName;
    const lastName = req.user.name.lastName ?? "";
    let userName;

    const existingUserName = await prismaClient.user.findUnique({
      where: {
        userName: `@${lastName ?? "_"}${firstName}`,
      },
    });
    if (existingUserName) {
      userName = `@${existingUserName}${Math.floor(Math.random() * 20)}`;
    } else {
      userName = `@${lastName ?? "_"}${firstName}`;
    }

    const profileImgUrl =
      req.user.photos.length !== 0 ? req.user.photos[0].value : "";

    const newUser = await prismaClient.user.create({
      data: {
        email: email,
        firstName,
        lastName,
        userName,
        profileImgUrl,
      },
    });
    const token = await JWTService.generateTokenFromUser(newUser);
    console.log(token, "token");
    res.cookie("token", token, { httpOnly: true });

    res.redirect("http://localhost:5000");
  }
);

export default router;
