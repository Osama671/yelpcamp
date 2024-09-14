import express from "express";
import catchAsync from "../../util/catchAsync.js";
import User from "../repositories/user.js";
import passport from "passport";
const router = express.Router();

router.get("/register", (req, res) => {
  res.send("Register page!");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    const { username, password, email } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    res.status(200).send("User Registered");
  })
);

router.get("/login", (req, res) => {});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("Sucessfully logged in!");
    res.status(200).send("Sucessfully logged");
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.status(200).send("Logged out sucessfully");
});

router.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
