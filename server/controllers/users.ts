import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import User, {
  checkIfEmailExists,
  checkIfUsernameExists,
} from "../repositories/users.ts";
import { Request, Response, NextFunction } from "express";
import { fetchUserDataFromDB } from "../repositories/users.ts";
import ExpressError from "../../src/util/ExpressError.ts";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    let { email } = req.body;
    email = email.trim();

    if (email.includes(" "))
      throw new ExpressError(
        "Ayyo why does Email have spaces in the middle",
        403
      );
    if (await checkIfEmailExists(email))
      throw new ExpressError("Email already in use", 403);
    if (await checkIfUsernameExists(username))
      throw new ExpressError("Username already in use", 403);

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
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
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
    const userId = String(id);
    if (!userId) throw new ExpressError("User not found", 401);
    const userData = await fetchUserDataFromDB(userId);
    return res.status(200).json(userData);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if(!req.user){
      throw new ExpressError("User not found", 404)
    }
    const user = await fetchUserDataFromDB(req.user._id.toString());
    await user.changePassword(oldPassword, newPassword);
    res.status(200).json({ message: "Password changed sucessfully" });
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
