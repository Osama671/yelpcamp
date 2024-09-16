import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv");
    dotenv.config();
  }

console.log(process.env.CLOUDINARY_CLOUD_NAME)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yelpcamp", // The folder where images will be uploaded in Cloudinary
    allowed_formats: ["jpeg", "png", "jpg"], // Allowed file formats
  },
});

const cloudinaries = {
  cloudinary,
  storage,
};

export default cloudinaries
