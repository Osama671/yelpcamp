import User from "../repositories/users.ts";
import {Request, Response, NextFunction} from "express"

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
