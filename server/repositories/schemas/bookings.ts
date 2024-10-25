import { Request, Response, NextFunction } from "express";
import ExpressError from "../../../src/util/ExpressError.ts";
import ExpressErrorGeneric from "../../../src/util/ExpressErrorGeneric.ts";

export const validateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentDateDay = Date.parse(new Date().toDateString())
    const { startDate, endDate } = req.body;
    const newStartDate = Date.parse(startDate);
    const newEndDate = Date.parse(endDate);
    if (newStartDate > newEndDate)
      throw new ExpressError("Start date can't be ahead of end date", 400);
    else if (newStartDate < +currentDateDay || newEndDate < +currentDateDay)
      throw new ExpressError(
        "Start date or end date can't be before your own date, C'mon bro",
        400
      );
    next();
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
