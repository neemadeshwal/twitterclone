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

    const email = (req.user && req.user?.email) ?? "";
    if (!email) {
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
    res.redirect("http://localhost:5000");
  }
);

export default router;
