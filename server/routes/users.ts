import express from "express";
import passport from "passport";
import {
  registerUser,
  logout,
  fetchUserData,
  resetUserPassword,
} from "../controllers/users.ts";
import { fetchReviewsByUserId } from "../controllers/reviews.ts";
import { fetchCampgroundsByUserId } from "../controllers/campgrounds.ts";
import { fetchBookingsByUserId } from "../controllers/bookings.ts";
import { validateRegisterUser } from "../repositories/schemas/schema.ts";
const router = express.Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", passport.authenticate("local", {}), (_, res) => {
  res.status(200).send("Sucessfully logged in");
});

router.post("/changepassword", resetUserPassword);

// Fetches user info/records
router.get("/user", fetchUserData);

router.get("/user/reviews", fetchReviewsByUserId);

router.get("/user/campgrounds", fetchCampgroundsByUserId);

router.get("/user/bookings", fetchBookingsByUserId);

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
