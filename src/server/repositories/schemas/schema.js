import Joi from "joi";
import ExpressError from "../../../util/ExpressError.js";
const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
      location: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required().min(10),
      title: Joi.string().required(),
      imageurl: Joi.string().required(),
    }).required();
    const result = campgroundSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(result.error.details, 401);
    } else {
      console.log("Next")
      next();
    }
  };

const validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
  const result = reviewSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(result.error.details, 401);
    } else {
      console.log("Next")
      next();
    }
}

export {validateCampground, validateReview}