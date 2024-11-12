import {
  showAllCampgrounds,
  showCampgroundEdit,
  editCampground,
  showCampgroundDetails,
  createCampground,
  deleteCampground,
} from "../controllers/campgrounds.ts";
import express from "express";
// import catchAsync from "../../util/catchAsync.ts";
// import { validateCampground } from "../repositories/schemas/schema.ts";
import multer from "multer";
import cloudinary from "../../src/cloudinary/cloudinary.ts";

const upload = multer({ storage: cloudinary.storage });

const router = express.Router();

router.get("/", showAllCampgrounds);

router.post("/", upload.array("images"), createCampground);

router.get("/:id", showCampgroundDetails);

router.delete("/:id", deleteCampground);

router.get("/:id/edit", showCampgroundEdit);

router.post("/:id/edit", upload.array("images"), editCampground);

export default router;
