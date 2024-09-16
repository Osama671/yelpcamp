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

router.post("/", upload.single("image"), (req, res) => {
  // req.body should contain other form data like title, location, price, description
  // req.file should contain the uploaded image file

  console.log("Body:", req.body);
  console.log("File:", req.file);

  if (!req.file) {
    return res.status(400).send("Image upload failed");
  }

  res.status(200).send("Files uploaded successfully");
});

router.get("/:id", catchAsync(showCampgroundDetails));

router.delete("/:id", catchAsync(deleteCampground));

router.get("/:id/edit", catchAsync(showCampgroundEdit));

router.post("/:id/edit", validateCampground, catchAsync(editCampground));

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ error: err.message });
  }
  next(err);
});
export default router;
