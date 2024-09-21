import Joi from "joi";
import ExpressError from "../../../util/ExpressError.ts";
import {Request, Response, NextFunction} from "express"

const validateCampground = (req: Request, _: Response, next: NextFunction) => {
    const campgroundSchema = Joi.object({
      location: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required().min(10),
      title: Joi.string().required(),
      imageurl: Joi.string().required(),
    }).required();
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")
      throw new ExpressError(errorMessage, 401);
    } else {
      next();
    }
  };

const validateReview = (req: Request, _: Response, next: NextFunction) => {
  const reviewSchema = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
  const {error} = reviewSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")
      throw new ExpressError(errorMessage, 401);
    } else {
      next();
    }
}

export {validateCampground, validateReview}