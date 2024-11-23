import Joi from "joi";
import ExpressError from "../../../src/util/ExpressError.ts";
import { Request, Response, NextFunction } from "express";

const validateCampground = (req: Request, _: Response, next: NextFunction) => {
  const campgroundSchema = Joi.object({
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(10),
    title: Joi.string().required(),
    imageurl: Joi.string().required(),
  }).required();
  //Add later: deleteImages: Joi.array()
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ExpressError(errorMessage, 401);
  } else {
    next();
  }
};

const validateReview = (req: Request, _: Response, next: NextFunction) => {
  const reviewSchema = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required();
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new ExpressError(errorMessage, 401);
  } else {
    next();
  }
};

const validateRegisterUser = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const registerSchema = Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(20)
      .pattern(/^[a-zA-Z0-9_-]+$/),
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().required().max(250).trim(),
  }).required();
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    console.log(errorMessage);
    throw new ExpressError(
      "Error in the form. Please review the fields and try again.",
      401
    );
  } else {
    next();
  }
};

const validateEditAndCreateCampground = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const campgroundSchema = Joi.object({
    title: Joi.string().min(8).max(100).required(),
    location: Joi.string().min(8).max(150).required(),
    price: Joi.number().min(8).max(1000000).required(),
    description: Joi.string().min(30).max(1500).required(),
    longitude: Joi.number().min(-180).max(180).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    deleteImages: Joi.optional(),
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    console.log(errorMessage);
    throw new ExpressError(
      "Error in the form. Please review the fields and try again.",
      401
    );
  } else {
    next();
  }
};

export {
  validateCampground,
  validateReview,
  validateRegisterUser,
  validateEditAndCreateCampground,
};
