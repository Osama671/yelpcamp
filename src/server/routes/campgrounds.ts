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
import cloudinary from "../../cloudinary/cloudinary.ts";

const upload = multer({ storage: cloudinary.storage });

const router = express.Router();

// GOING TO TRY USING THIS LATER. WILL KEEP FOR NOW.
// const isAuthor = async(req, res, next) => {
//   const { id } = req.params;
//   const campground = await findCampgroundById(id);
//   console.log(campground.author)
//   console.log(req.user._id)
//   if (!campground) throw new ExpressError("Campground not found", 500);
//   if (!campground.author.equals(req.user._id)) {
//     return new ExpressError("You are not the author of this campground", 403);
//   }
// };

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

router.get("/:id", showCampgroundDetails);

router.delete("/:id", deleteCampground);

router.get("/:id/edit", showCampgroundEdit);

router.post("/:id/edit", upload.array("images"), editCampground);

export default router;
