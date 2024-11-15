import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import User from "../repositories/users.ts";
import { Request, Response, NextFunction } from "express";
import { fetchUserDataFromDB } from "../repositories/users.ts";
import ExpressError from "../../src/util/ExpressError.ts";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const user = new User({ email, username });
  const registeredUser = await User.register(user, password);
  await new Promise<void>((resolve, reject) => {
    req.login(registeredUser, (err) => {
      if (err) {
        console.log("ERROR: ", err);
        return reject(err);
      }
      resolve();
    });
  });
  res.status(200).send("User Registered");
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.status(200).send("Logged out sucessfully");
};

export const fetchUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const userId = String(id)
    if (!userId) throw new ExpressError("User not found", 401);
    const userData = await fetchUserDataFromDB(userId);
    return res.status(200).json(userData);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try{
    const {userId, oldPassword, newPassword} = req.body
    const user = await fetchUserDataFromDB(userId)
    await user.changePassword(oldPassword, newPassword)
    res.status(200).json({message: "Password changed sucessfully"})
  }
  catch (e){
    ExpressErrorGeneric(res, e)
  }
}
