import model from "../repositories/mongoose.js";
import { Request, Response } from "express";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.js";
import ExpressError from "../../src/util/ExpressError.ts";
import redisClient from "../redis.ts";
import cloudinary from "../../src/cloudinary/cloudinary.ts";

export const showAllCampgrounds = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const productsPerPage = req.query.productsPerPage
      ? Number(req.query.productsPerPage)
      : 0;

    const searchQuery = req.query.searchQuery
      ? String(req.query.searchQuery)
      : "";

    //Return cached campgrounds
    if (searchQuery === "") {
      if (productsPerPage === 0) {
        const cacheSuccess = await cacheAllCampgrounds(res);
        if (cacheSuccess === true) return;
      }
      if (productsPerPage !== 0) {
        const cachceSuccess = await cachePaginatedCampgrounds(res, page);
        if (cachceSuccess === true) return;
      }
    }
    console.log("Fetching campgrounds from db...");
    const campgrounds = await model.findAllCampgrounds(
      page,
      productsPerPage,
      searchQuery
    );

    if (!campgrounds)
      return res.status(404).json({ message: "Campgrounds not found" });

    if (searchQuery === "") {
      if (productsPerPage === 0)
        await redisClient.set("allCampgrounds", JSON.stringify(campgrounds));
      if (productsPerPage !== 0)
        await redisClient.set(
          `paginatedCampgrounds/${page}`,
          JSON.stringify(campgrounds)
        );
    }
    return res.json(campgrounds);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const showCampgroundEdit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User is not logged in." });
    }
    const { id } = req.params;
    const userid = req.user._id;
    const campground = await model.findCampgroundById(id);
    if (!campground) {
      throw new ExpressError("Campground not found", 404);
    }
    if (!campground.author?.equals(userid)) {
      throw new ExpressError("You are not the author of this campground", 403);
    }
    return res.status(200).json(campground);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const editCampground = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User is not logged in." });
  }
  try {
    const { id: campgroundId } = req.params;
    const { location, description, price, title } = req.body;
    let { deleteImages } = req.body;
    if (!Array.isArray(deleteImages) && deleteImages !== undefined)
      deleteImages = [deleteImages];

    const { longitude, latitude } = req.body;
    const geometry = { coordinates: [+longitude, +latitude] };

    const userid = req.user._id;
    const files = req.files as Express.Multer.File[];

    const campgroundImages = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const cldRes = await cloudinary.handleUpload(dataURI);
        return {
          url: cldRes.url,
          filename: cldRes.public_id,
        };
      })
    );

    await model.editCampground(
      geometry,
      campgroundId,
      location,
      description,
      price,
      title,
      campgroundImages,
      userid,
      deleteImages
    );
    clearCache();
    res.status(200).send("Campground Edited Sucessfully");
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const showCampgroundDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campground = await model.findCampgroundById(id);
    if (!campground) {
      return res.status(404).json({ message: "Campground not found" });
    }
    res.json(campground);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const createCampground = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { longitude, latitude } = req.body;
    const geometry = { coordinates: [+longitude, +latitude] };

    const { location, description, price, title } = req.body;
    const userid = req.user._id;

    const files = req.files as Express.Multer.File[];

    const campgroundImages = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const cldRes = await cloudinary.handleUpload(dataURI);
        return {
          url: cldRes.url,
          filename: cldRes.public_id,
        };
      })
    );
    const campground = await model.createCampground(
      geometry,
      location,
      description,
      price,
      title,
      campgroundImages,
      userid
    );
    clearCache();
    return res.status(200).json({ campgroundId: campground._id });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const deleteCampground = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { id } = req.params;
    const userid = req.user._id;
    await model.deleteCampgroundById(id, userid);
    clearCache();
    return res.status(200).json({ message: `Campground ID ${id} Deleted.` });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const fetchCampgroundsByUserId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ExpressError("User not found", 401);
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const productsPerPage = req.query.productsPerPage
      ? Number(req.query.productsPerPage)
      : 0;
    const { id } = req.query;
    const userId = String(id);
    const campgrounds = await model.fetchCampgroundsByUserId(
      userId,
      page,
      productsPerPage
    );
    return res.status(200).json(campgrounds);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export async function fetchSearchDropdownResults(req: Request, res: Response) {
  try {
    const searchQuery = String(req.query.searchQuery);
    console.log(searchQuery)
    const searchResults = await model.fetchSearchDropdownResults(searchQuery);
    res.status(200).json(searchResults)
  } catch (e) {
    console.error(`Error in server: `, e);
    ExpressErrorGeneric(res, e);
  }
}

async function cacheAllCampgrounds(res: Response) {
  try {
    const cacheValue = await redisClient.get("allCampgrounds");
    if (cacheValue) {
      res.status(200).json(JSON.parse(cacheValue));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(`Error clearing campgrounds cache ${e}`);
  }
}

async function cachePaginatedCampgrounds(res: Response, pageNumber: number) {
  try {
    const cacheValue = await redisClient.get(
      `paginatedCampgrounds/${pageNumber}`
    );
    if (cacheValue) {
      res.status(200).json(JSON.parse(cacheValue));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(`Error clearing paginated campgrounds cache ${e}`);
  }
}

export async function clearCache() {
  try {
    await redisClient.del("allCampgrounds");
    const pattern = "paginatedCampgrounds/*";
    let cursor = 0;

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      const keys = reply.keys;

      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== 0);
  } catch (e) {
    console.error(`Error clearing cache ${e}`);
  }
}
