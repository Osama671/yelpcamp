import model from "../repositories/mongoose.js";
import { Request, Response } from "express";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js"; //.d.ts file module path edited with .js extension
const mapBoxToken = process.env.MAPBOX_TOKEN || "";

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

interface IImageIterable {
  filename: string;
  url: string;
  path: string;
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
  const { location, description, price, title, deleteImages } = req.body;
  const userid = req.user._id;
  const files = req.files as Express.Multer.File[];

  const campgroundImages = files.map((f: IImageIterable) => ({
    url: f.path,
    filename: f.filename,
  }));
  await model.editCampground(
    id,
    location,
    description,
    price,
    title,
    campgroundImages,
    userid,
    deleteImages
  );
  res.redirect(`/campground/${id}`);
};

export const showCampgroundDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const campground = await model.findCampgroundById(id);
  res.json(campground);
};

export const createCampground = async (req: Request, res: Response) => {
  const geodata = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  const geometry = geodata.body.features[0].geometry
  if (!req.user) {
    return res.json({ message: "User not found" });
  }

  const { location, description, price, title } = req.body;
  const userid = req.user._id;

  const files = req.files as Express.Multer.File[];

  const campgroundImages = files.map((f: IImageIterable) => ({
    url: f.path,
    filename: f.filename,
  }));
  await model.createCampground(
    geometry,
    location,
    description,
    price,
    title,
    campgroundImages,
    userid
  );
  res.status(200).send("Campground created!");
};

export const deleteCampground = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ message: "User not found" });
  }
  if (!req.user._id) {
    return res.json({ message: "No id" });
  }
  const { id } = req.params;
  const userid = req.user._id;
  await model.deleteCampgroundById(id, userid);
  res.status(200).json({ message: `Campground ID ${id} Deleted.` });
};