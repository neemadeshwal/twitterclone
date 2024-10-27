import Express from "express";

const router = Express.Router();

router.get("/auth/google");
router.get("/auth/google/callback");

export default router;
