import express from "express";
import passport from "passport";
import { registerUser, logout, fetchUserData } from "../controllers/users.ts";
const router = express.Router();

router.post("/register", registerUser);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (_, res) => {
    res.status(200).send("Sucessfully logged");
  }
);

// Fetches user info/records
router.get("/user", fetchUserData);

router.get("/logout", logout);

router.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Fetches user ID
router.get("/auth/getuser", (req, res) => {
  res.json(req.user);
});
export default router;
