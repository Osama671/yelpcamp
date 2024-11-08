import {
  showAllCampgrounds,
  showCampgroundEdit,
  editCampground,
  showCampgroundDetails,
  createCampground,
  deleteCampground,
  fetchCampgroundsByUserId,
} from "../controllers/campgrounds.ts";
import express from "express";
// import catchAsync from "../../util/catchAsync.ts";
// import { validateCampground } from "../repositories/schemas/schema.ts";
import multer from "multer";
import cloudinary from "../../src/cloudinary/cloudinary.ts";

const upload = multer({ storage: cloudinary.storage });

const router = express.Router();


router.get("/", showAllCampgrounds);
router.post(
  "/",

  upload.array("images"),
  createCampground,
  (req, res) => {
    console.log(req.body, "-----", req.files);
    res.status(200).send("Upload completed");
  }
);

router.get("/user", fetchCampgroundsByUserId)

router.get("/:id", showCampgroundDetails);

router.delete("/:id", deleteCampground);

router.get("/:id/edit", showCampgroundEdit);

router.post("/:id/edit", upload.array("images"), editCampground);

export default router;
