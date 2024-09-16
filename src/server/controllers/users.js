import User from "../repositories/user.js";

export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User({ email, username });
  const registeredUser = await User.register(user, password);
  await new Promise((resolve, reject) => {
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

export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.status(200).send("Logged out sucessfully");
};
