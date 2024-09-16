import express from "express";
import catchAsync from "../../util/catchAsync.js";
import passport from "passport";
import { registerUser, logout } from "../controllers/users.js";
const router = express.Router();

router.post("/register", catchAsync(registerUser));

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.status(200).send("Sucessfully logged");
  }
);

router.get("/logout", logout);

router.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

router.get("/auth/getuser", (req, res) => {
  console.log("Express user:", req.user);
  res.json(req.user);
});
export default router;
