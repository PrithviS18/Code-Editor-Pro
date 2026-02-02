import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    picture: string;
    subscription: boolean;
    refreshToken: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    subscription: { type: Boolean, default: false },
}, { 
    timestamps: true
})


/* Pre-save hook to hash password - before saving it to the database */
userSchema.pre("save", async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
