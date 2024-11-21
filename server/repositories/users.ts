import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("User", UserSchema);

export async function fetchUserDataFromDB(userId: string) {
  try {
    const user = await userModel.findById(userId);
    return user;
  } catch (e) {
    console.log(`Error in DB: ${e}`);
  }
}

export async function checkIfEmailExists(email: string) {
  try {
    const fetchedUser = await userModel.findOne({ email: email });
    return fetchedUser;
  } catch (e) {
    console.log(`Error in DB: ${e}`);
  }
}

export async function checkIfUsernameExists(username: string) {
  try {
    const fetchedUser = await userModel.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    });
    return fetchedUser;
  } catch (e) {
    console.log(`Error in DB: ${e}`);
  }
}

export default userModel;
