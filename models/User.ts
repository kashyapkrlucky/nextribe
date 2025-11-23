import mongoose, { Schema, models, Model } from "mongoose";
import { IUser } from "@/types/index.types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);