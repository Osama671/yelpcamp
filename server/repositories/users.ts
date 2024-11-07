import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose)

const userModel = mongoose.model('User', UserSchema)

export async function fetchUserDataFromDB(userId: string) {
    console.log("DB: ", userId)
    const user = await userModel.findById(userId)
    console.log("DB INFO: ", user)
    return user;
}

export default userModel
