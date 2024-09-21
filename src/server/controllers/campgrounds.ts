import model from "../repositories/mongoose.js";
import { Request, Response } from "express";

interface IImageIterable {
  filename: string;
  url: string;
  path: string
}

export const showAllCampgrounds = async (_: Request, res: Response) => {
  const campgrounds = await model.findAllCampgrounds();
  res.json(campgrounds);
};

export const showCampgroundEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const campground = await model.findCampgroundById(id);
  res.json(campground);
};

export const editCampground = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ message: "User not found" });
  }
  const { id } = req.params;
  const { location, description, price, title, imageurl } = req.body;
  const userid = req.user._id;
  console.log("USER ID: ", userid);
  await model.editCampground(
    id,
    location,
    description,
    price,
    title,
    imageurl,
    userid
  );
  res.redirect(`/campground/${id}`);
};

export const showCampgroundDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const campground = await model.findCampgroundById(id);
  res.json(campground);
};

export const createCampground = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ message: "User not found" });
  }

  const { location, description, price, title } = req.body;
  const userid = req.user._id;

  const files = req.files as Express.Multer.File[];
  console.log("FILES: ", files)

  const campgroundImages = files.map((f: IImageIterable) => ({
    url: f.path,
    filename: f.filename,
  }));
  await model.createCampground(
    location,
    description,
    price,
    title,
    campgroundImages,
    userid
  );
  res.redirect("/campgrounds");
};

export const deleteCampground = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ message: "User not found" });
  }
  if(!req.user._id){
    return res.json(({message: "No id"}))
  }
  const { id } = req.params;
  const userid = req.user._id;
  await model.deleteCampgroundById(id, userid);
  res.status(200).json({ message: `Campground ID ${id} Deleted.` });
};
