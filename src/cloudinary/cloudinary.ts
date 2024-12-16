import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const dotenv = await import("dotenv");
dotenv.config();

interface ICloudinaries {
  cloudinary: typeof cloudinary;
  storage: CloudinaryStorage;
  handleUpload: (file: string) => Promise<UploadApiResponse>;
}

interface IFolder {
  folder: string;
  allowed_formats: string[];
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yelpcamp",
    allowed_formats: ["jpeg", "png", "jpg"],
  } as IFolder,
});

async function handleUpload(file: string) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "yelpcamp",
  });
  return res;
}

const cloudinaries: ICloudinaries = {
  cloudinary,
  storage,
  handleUpload,
};

export default cloudinaries;
