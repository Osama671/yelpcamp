import {
  showAllCampgrounds,
  showCampgroundEdit,
  editCampground,
  showCampgroundDetails,
  createCampground,
  deleteCampground,
} from "../controllers/campgrounds.js";
import express from "express";
import catchAsync from "../../util/catchAsync.js";
import { validateCampground } from "../repositories/schemas/schema.js";
import multer from "multer";
import cloudinary from "../../cloudinary/index.js";
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

router.get("/", catchAsync(showAllCampgrounds));
// catchAsync(createCampground)
router.post(
  "/",
  upload.array("images"),
  catchAsync(createCampground),
  (req, res) => {
    console.log(req.body, "-----", req.files);
    res.status(200).send("Upload completed")
  },
  catchAsync(createCampground)
);

router.get("/:id", catchAsync(showCampgroundDetails));

router.delete("/:id", catchAsync(deleteCampground));

router.get("/:id/edit", catchAsync(showCampgroundEdit));

router.post("/:id/edit", validateCampground, catchAsync(editCampground));

export default router;
